// Tập hợp love được chạm
const loveTaps = new Set();
let userName = '';

// ----- CÓ THỂ TÙY CHỈNH Ở ĐÂY -----
const thoiGianChoGiay = 5; // Số giây đếm ngược (ví dụ: 7 giây)
const trangWebChuyenHuong = " https://vuuu8886.github.io/tangemx/"; // Đường dẫn web muốn chuyển đến (ví dụ vui)
// ----- KẾT THÚC PHẦN TÙY CHỈNH -----

function startApp() {
  const stageIds = ['cardStage', 'startStage', 'inputStage', 'loveStage'];
  const stages = Object.fromEntries(stageIds.map(id => [id, document.getElementById(id)]));

  if (Object.values(stages).some(stage => !stage)) {
    console.error('Thiếu một trong các element stage!');
    Swal.fire('Lỗi!', 'Không tìm thấy một số thành phần của trang. Vui lòng thử lại.', 'error');
    return;
  }

  stages.startStage.style.display = 'none';
  stages.inputStage.style.display = 'block'; // Sẽ bị ẩn ngay bởi SweetAlert
  stages.loveStage.style.display = 'none';
  stages.cardStage.style.display = 'none';

  const bgMusic = document.getElementById('bgMusic');
  if (bgMusic) {
    bgMusic.play().catch(err => {
      console.warn('Không thể tự động phát nhạc:', err);
      // Có thể thêm một nút để người dùng chủ động bật nhạc nếu muốn
    });
  }

  inipesan();
}

// Hiệu ứng gõ chữ
function typeWriterEffect(text, elementId, callback) {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Không tìm thấy element với ID: ${elementId}`);
    return;
  }

  let i = 0;
  const speed = 50; // Tốc độ gõ chữ (ms)
  element.innerHTML = ''; // Xóa nội dung cũ trước khi gõ

  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    } else {
      console.log('Hiệu ứng gõ hoàn tất');
      if (callback) callback();
    }
  }
  type();
}

function switchStage(fromId, toId, withFade = false) {
  const fromElement = document.getElementById(fromId);
  const toElement = document.getElementById(toId);

  if (!fromElement || !toElement) {
    console.error(`Không tìm thấy element: ${fromId} hoặc ${toId}`);
    return;
  }

  if (withFade) {
    fromElement.classList.add('hidden'); // Thêm class để bắt đầu transition CSS
    setTimeout(() => {
      fromElement.style.display = 'none';
      // fromElement.classList.remove('hidden'); // Xóa class sau khi ẩn hẳn
      
      toElement.style.display = 'block';
      // Buộc reflow để animation/transition của toElement hoạt động đúng
      // eslint-disable-next-line no-unused-expressions
      toElement.offsetHeight; 
      toElement.classList.remove('hidden'); // Xóa class để chạy transition CSS (nếu có)
    }, 1000); // Thời gian khớp với transition trong CSS
  } else {
    fromElement.style.display = 'none';
    toElement.style.display = 'block';
    toElement.classList.remove('hidden'); // Đảm bảo stage mới không bị class hidden
  }
}

function tapLove(id) {
  if (loveTaps.has(id)) return;

  const loveIcon = document.querySelector(`#loveIcons .love-icon:nth-child(${id})`);
  if (loveIcon) {
    loveIcon.classList.add('tapped');
  }
  loveTaps.add(id);
  console.log(`Chạm love ${id}, tổng: ${loveTaps.size}`);

  if (loveTaps.size === 4) {
    Swal.fire({
      title: 'Đủ 4 love rồi nè!',
      text: 'Sẵn sàng nhận quà chưa? 💖',
      timer: 1500,
      icon: 'success',
      showConfirmButton: false,
      background: '#fffbe7',
      customClass: { title: 'swal-title', content: 'swal-text' }
    }).then(() => {
      switchStage('loveStage', 'cardStage', true);

      const loveMsgElement = document.getElementById('loveMsg');
      if (!loveMsgElement) {
          console.error('Không tìm thấy element loveMsg!');
          return;
      }

      typeWriterEffect(
        `Chúc ${userName} em bé của anhh luôn xinh đẹp luôn dễ thương cute , vì em rực rỡ như mặt trời, đâu thể để hôm nay buồn xám được!☀️
Em bé ơi, mệt thì dựa vào anh, yếu lòng thì để anh thương nha!💗
Thế giới có thể quay cuồng, nhưng anh thì chỉ xoay quanh mỗi em bé thôi!🌍❤️
Cố lên công chúa của anh, vì vương miện của em chưa bao giờ rơi cả! 👑✨
Hôm nay có mệt không em bé? Đưa anh hết mệt mỏi, nhận lại ôm yêu nè 🤗💕
Đừng quên là, em không chỉ có một ngày, em còn có cả anh!😚
Em bé mạnh mẽ lắm, nhưng vẫn được quyền dựa vào anh mà!💪💞
Mỗi lần em muốn bỏ cuộc, nhớ có anh đang chờ em ở cuối chặng đường nhé! 🛤️❤️
Yêu em bé là điều dễ nhất, còn làm em vui là điều anh luôn muốn nhất! 💬💘
Em bước một bước, anh bước mười bước. Em mệt một chút, anh ôm cả phần còn lại!" 🐾💓`,
        'loveMsg',
        () => {
          const cardElement = document.querySelector('#cardStage .card');
          if (!cardElement) {
            console.error('Không tìm thấy .card element');
            return;
          }

          const countdownContainer = document.createElement("div");
          countdownContainer.id = 'countdownContainer';
          // Style cho countdownContainer đã được định nghĩa trong CSS
          
          // Chèn countdownContainer vào trong .card, sau #loveMsg
          loveMsgElement.insertAdjacentElement('afterend', countdownContainer);


          let currentSeconds = thoiGianChoGiay;

          const updateCountdown = () => {
            if (currentSeconds > 0) {
              countdownContainer.innerHTML = `Một bất ngờ nhỏ dành cho em sẽ xuất hiện sau: <br><strong>${currentSeconds} giây</strong> nữa! 😉`;
              currentSeconds--;
            } else {
              countdownContainer.innerHTML = "Chuẩn bị nhận bất ngờ nàooooo... 🚀";
              clearInterval(countdownInterval);
              setTimeout(() => {
                  window.location.href = trangWebChuyenHuong;
              }, 1500); // Đợi 1.5 giây sau khi thông báo cuối cùng rồi mới chuyển trang
            }
          };

          const countdownInterval = setInterval(updateCountdown, 1000);
          updateCountdown(); // Hiển thị lần đầu ngay lập tức
        }
      );
    });
  }
}

async function inipesan() {
  // Ẩn inputStage vì SweetAlert sẽ thay thế nó
  const inputStageElement = document.getElementById('inputStage');
  if (inputStageElement) inputStageElement.style.display = 'none';

  const { value: typedName, isConfirmed } = await Swal.fire({
    title: 'Để nhận quà, nhập tên của bé iu vào đây nha:',
    input: 'text',
    inputPlaceholder: 'Tên bé iu...',
    inputValue: '',
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: true,
    confirmButtonText: 'Xác nhận <i class="fas fa-check"></i>', // icon nếu có FontAwesome
    confirmButtonColor: '#ff4081',
    validationMessage: 'Tên không được để trống đâu nè!  xinh gái viết tên vào đây nhé',
    customClass: { title: 'swal-title', content: 'swal-text' },
    preConfirm: (name) => {
      if (!name || name.trim() === '') {
        Swal.showValidationMessage('Tên không được để trống đâu nè! xinh gái viết tên vào đây nhé');
        return false; // Ngăn đóng popup
      }
      return name.trim();
    }
  });

  if (isConfirmed && typedName) {
    userName = typedName;
    loveTaps.clear(); // Reset số lần chạm love
    document.querySelectorAll('.love-icon').forEach(icon =>
      icon.classList.remove('tapped')
    );
    // Đảm bảo inputStage (dù đã ẩn) không gây cản trở
    // và chuyển sang loveStage
    switchStage('inputStage', 'loveStage'); 
  } else {
    // Người dùng nhấn cancel hoặc đóng popup mà không nhập tên
    await Swal.fire({
      icon: 'info',
      title: 'Tiếc quá!',
      text: 'Bạn cần nhập tên để tiếp tục. Hãy nhấn vào hộp quà để thử lại nhé!',
      confirmButtonText: 'OK',
      confirmButtonColor: '#ff4081',
      customClass: { title: 'swal-title', content: 'swal-text' }
    });
    // Đưa về màn hình ban đầu
    document.getElementById('startStage').style.display = 'block';
    document.getElementById('loveStage').style.display = 'none';
    document.getElementById('cardStage').style.display = 'none';
    if (inputStageElement) inputStageElement.style.display = 'none';
  }
}

// Tùy chọn: Nếu muốn đảm bảo các stage bị ẩn khi chưa cần thiết
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('inputStage').style.display = 'none';
  document.getElementById('loveStage').style.display = 'none';
  document.getElementById('cardStage').style.display = 'none';
});