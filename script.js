const video = document.getElementById("video");
const cameraSensor = document.querySelector("#camera--sensor");
const permissionBtn = document.getElementById("permission-btn");
const takeSelfieBtn = document.getElementById("selfie-btn");
const anotherSelfieBtn = document.getElementById("another-btn");
const downloadImg = document.getElementById("img-to-download");
const constraints = { video: { facingMode: "user" }, audio: false };

const canvas = document.getElementById("canvas");
canvas.width = 640;
canvas.height = 480;

// canvas.style.display = "none";
cameraSensor.style.display = "none";
downloadImg.style.display = "none";
anotherSelfieBtn.style.display = "none";

const context = canvas.getContext("2d");
const lego = new legra(context, 20);
lego.rectangle(0, 0, 32, 32, { filled: true, color: 'green' });


permissionBtn.addEventListener("click", () => {
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(stream => {
            video.srcObject = stream;
            permissionBtn.style.display = "none";
            anotherSelfieBtn.style.display = "inline-block";
        })
        .catch(error => {
            console.error(error);
        });
});

takeSelfieBtn.addEventListener("click", () => {
    cameraSensor.width = video.videoWidth;
    cameraSensor.height = video.videoHeight;
    cameraSensor.getContext("2d").drawImage(video, 0, 0);
    let imgToLego = cameraSensor.toDataURL("image/png");
    drawImg(imgToLego);
});

anotherSelfieBtn.addEventListener("click", () => {
    canvas.style.display = "none";
    video.style.display = "block";
});

const loadImage = async src => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.addEventListener("load", () => {
            resolve(img);
        });
        img.addEventListener("error", () => {
            reject(new Error("Failed to load image"));
        });
        img.addEventListener("abort", () => {
            reject(new Error("Image load aborted"));
        });
        img.src = src;
    });
};

const drawImg = async imgToLego => {
    try {
        const img = await loadImage(imgToLego);
        context.clearRect(0, 0, 650, 480);
        lego.drawImage(img, [0, 0]);
        video.style.display = "none";
        cameraSensor.style.display = "none";
        canvas.style.display = "block";
        let imgToDownload = canvas.toDataURL("image/png");
        downloadImg.href = imgToDownload;
        downloadImg.style.display = "block";
    } catch (err) {
        console.error(err);
    }
};
