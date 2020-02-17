const video = document.getElementById('video');
const cameraSensor = document.querySelector("#camera--sensor");
const startVideoBtn = document.getElementById('btn');
const takeSelfieBtn = document.getElementById('selfie-btn');
const constraints = { video: { facingMode: "user" }, audio: false };

const canvas = document.getElementById('canvas');
canvas.width = 650;
canvas.height = 480;    

canvas.style.display = "none";
cameraSensor.style.display = "none";

startVideoBtn.addEventListener('click', () => {
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(error => {
            console.error(error);
        });
});

takeSelfieBtn.addEventListener('click', () => {
    cameraSensor.width = video.videoWidth;
    cameraSensor.height = video.videoHeight;
    cameraSensor.getContext("2d").drawImage(video, 0, 0);
    let imgToLego = cameraSensor.toDataURL("image/webp");
    drawImg(imgToLego);
});



const loadImage = async (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.addEventListener('load', () => {
        resolve(img);
      });
      img.addEventListener('error', () => {
        reject(new Error('Failed to load image'));
      });
      img.addEventListener('abort', () => {
        reject(new Error('Image load aborted'));
      });
      img.src = src;
    });
  };

const drawImg = async imgToLego => {
    const context = canvas.getContext('2d');
    const lego = new legra(context, 24, {color: 'blue'});
    try {
        const img = await loadImage(imgToLego);
        context.clearRect(0, 0, 650, 480);
        lego.drawImage(img, [0, 0]);
        video.style.display = "none";
        cameraSensor.style.display = "none";
        canvas.style.display = "block";

    } catch (err) {
        console.error(err);
    }
  };


