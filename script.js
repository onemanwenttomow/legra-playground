const video = document.getElementById("video");
const cameraSensor = document.querySelector("#camera--sensor");
const permissionBtn = document.getElementById("permission-btn");
const makeBricksBtn = document.getElementById("make-bricks-btn");
const anotherSelfieBtn = document.getElementById("another-btn");
const downloadImg = document.getElementById("img-to-download");
const userImage = document.getElementById("user-image");
const dropArea = document.getElementsByClassName('drop-area')[0];

const constraints = { video: { facingMode: "user" }, audio: false };
var userUploadedImg;

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

makeBricksBtn.addEventListener("click", () => {
    console.log(document.querySelector('main').children[0].nodeName)
    if (document.querySelector('main').children[0].nodeName === 'IMG') {
        document.querySelector('main').children[0].style.display = 'none';
        console.log("userUploadedImg", userUploadedImg)
        drawImg(userUploadedImg);
    } else {
        cameraSensor.width = video.videoWidth;
        cameraSensor.height = video.videoHeight;
        cameraSensor.getContext("2d").drawImage(video, 0, 0);
        let imgToLego = cameraSensor.toDataURL("image/png");
        drawImg(imgToLego);
    }
    
});

anotherSelfieBtn.addEventListener("click", () => {
    canvas.style.display = "none";
    video.style.display = "block";
});

dropArea.addEventListener('drop', handleDrop, false)
userImage.addEventListener('change', handleChange);

function handleDrop(e) {
    console.log('DROP!');
}

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

function handleChange(e) {
    var img = new Image();
    console.log("file changed!")
    console.log(userImage.files[0]);
    const file = userImage.files[0];
    
    if(file.type.match(/image.*/)) {
        console.log('An image has been loaded');

        // Load the image
        var reader = new FileReader();
        reader.onload = function (readerEvent) {
            var image = new Image();
            image.onload = function (imageEvent) {

                // Resize the image
                var canvas = document.createElement('canvas'),
                    max_size = 640,// TODO : pull max size from a site config
                    width = image.width,
                    height = image.height;
                if (width > height) {
                    if (width > max_size) {
                        height *= max_size / width;
                        width = max_size;
                    }
                } else {
                    if (height > max_size) {
                        width *= max_size / height;
                        height = max_size;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                canvas.getContext('2d').drawImage(image, 0, 0, width, height);
                userUploadedImg = canvas.toDataURL('image/jpeg');
                var newImg = new Image();
                console.log("userUploadedImg after upload...", userUploadedImg)
                newImg.src = userUploadedImg;
                newImg.style.position = "absolute";
                document.querySelector('main').prepend(newImg);
                document.querySelector('main').children[0].style.display = 'block';

            }
            image.src = readerEvent.target.result;
        }
        reader.readAsDataURL(file);
    }

}


var dataURLToBlob = function(dataURL) {
    var BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
        var parts = dataURL.split(',');
        var contentType = parts[0].split(':')[1];
        var raw = parts[1];

        return new Blob([raw], {type: contentType});
    }

    var parts = dataURL.split(BASE64_MARKER);
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;

    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], {type: contentType});
}