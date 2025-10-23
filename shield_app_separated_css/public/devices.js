// 등록된 기기 목록
let registeredDevices = [];

// 페이지 로드 시 기기 목록 불러오기
async function loadDevices() {
  try {
    const response = await fetch('/api/devices');
    if (response.ok) {
      registeredDevices = await response.json();
      renderRegisteredDevices();
    }
  } catch (error) {
    console.error('기기 목록 로드 실패:', error);
    // LocalStorage에서 백업 데이터 로드
    const savedDevices = localStorage.getItem('registeredDevices');
    if (savedDevices) {
      registeredDevices = JSON.parse(savedDevices);
      renderRegisteredDevices();
    }
  }
}

// 기기 등록 처리
async function handleDeviceSubmit(e) {
  e.preventDefault();

  const deviceId = document.getElementById('deviceId').value;
  const deviceType = document.getElementById('deviceType').value;
  const deviceName = document.getElementById('deviceName').value;
  const deviceLocation = document.getElementById('deviceLocation').value;
  const deviceDate = document.getElementById('deviceDate').value;

  const typeNames = {
    'window': '창문 센서',
    'voice': '음성 녹음 장치',
    'camera': 'CCTV 카메라',
    'door': '출입문 센서'
  };

  const newDevice = {
    device_id: deviceId,
    device_type: deviceType,
    device_name: deviceName || typeNames[deviceType],
    location: deviceLocation,
    install_date: deviceDate
  };

  try {
    const response = await fetch('/api/devices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newDevice)
    });

    if (response.ok) {
      alert('기기가 성공적으로 등록되었습니다!');
      document.getElementById('deviceForm').reset();
      loadDevices(); // 목록 새로고침
    } else {
      const error = await response.json();
      alert('기기 등록 실패: ' + (error.error || '알 수 없는 오류'));
    }
  } catch (error) {
    console.error('기기 등록 오류:', error);
    // LocalStorage에 백업 저장
    saveToLocalStorage(newDevice);
    alert('기기가 로컬에 저장되었습니다. (서버 연결 실패)');
  }
}

// LocalStorage에 저장
function saveToLocalStorage(device) {
  const savedDevices = localStorage.getItem('registeredDevices');
  const devices = savedDevices ? JSON.parse(savedDevices) : [];
  
  devices.push({
    ...device,
    id: Date.now(),
    created_at: new Date().toISOString()
  });
  
  localStorage.setItem('registeredDevices', JSON.stringify(devices));
  registeredDevices = devices;
  renderRegisteredDevices();
  document.getElementById('deviceForm').reset();
}

// 등록된 기기 목록 렌더링
function renderRegisteredDevices() {
  const list = document.getElementById('registeredDevicesList');
  
  if (registeredDevices.length === 0) {
    list.innerHTML = '<div style="text-align: center; padding: 40px 20px; color: var(--gray-500); font-size: 14px;">등록된 기기가 없습니다</div>';
    return;
  }

  const typeNames = {
    'window': '창문 센서',
    'voice': '음성 녹음 장치',
    'camera': 'CCTV 카메라',
    'door': '출입문 센서'
  };

  list.innerHTML = registeredDevices.map((device, index) => `
    <div class="registered-device-card">
      <div class="registered-device-info">
        <h4 style="font-size: 16px; font-weight: 600; margin-bottom: 6px; color: var(--gray-900);">
          ${device.device_name || typeNames[device.device_type]}
        </h4>
        <p style="font-size: 13px; color: var(--gray-600); margin-bottom: 4px;">
          <strong>ID:</strong> ${device.device_id}
        </p>
        <p style="font-size: 13px; color: var(--gray-600); margin-bottom: 4px;">
          <strong>타입:</strong> ${typeNames[device.device_type] || device.device_type}
        </p>
        <p style="font-size: 13px; color: var(--gray-600); margin-bottom: 4px;">
          <strong>위치:</strong> ${device.location}
        </p>
        <p style="font-size: 13px; color: var(--gray-600);">
          <strong>설치일:</strong> ${formatDate(device.install_date)}
        </p>
      </div>
      <button class="device-delete-btn" onclick="deleteDevice(${device.id || index})">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" style="width: 18px; height: 18px;">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        </svg>
      </button>
    </div>
  `).join('');
}

// 기기 삭제
async function deleteDevice(deviceId) {
  if (!confirm('이 기기를 삭제하시겠습니까?')) {
    return;
  }

  try {
    const response = await fetch(`/api/devices/${deviceId}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      alert('기기가 삭제되었습니다.');
      loadDevices();
    } else {
      alert('기기 삭제에 실패했습니다.');
    }
  } catch (error) {
    console.error('기기 삭제 오류:', error);
    // LocalStorage에서 삭제
    const savedDevices = localStorage.getItem('registeredDevices');
    if (savedDevices) {
      let devices = JSON.parse(savedDevices);
      devices = devices.filter(d => d.id !== deviceId);
      localStorage.setItem('registeredDevices', JSON.stringify(devices));
      registeredDevices = devices;
      renderRegisteredDevices();
    }
  }
}

// 날짜 포맷팅
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// 페이지 로드 시 실행
window.addEventListener('DOMContentLoaded', () => {
  // 오늘 날짜를 기본값으로 설정
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('deviceDate').value = today;
  
  // 기기 목록 로드
  loadDevices();
});
