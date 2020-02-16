canvas = document.getElementById('canvas');
context = canvas.getContext('2d');

const lego = new legra(context, 16, {color: 'blue'});

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

const drawImg = async () => {
    console.log("drawing...")
    try {
      const img = await loadImage('https://images-na.ssl-images-amazon.com/images/I/81Wgl8rZpHL._AC_SY679_.jpg');
      context.clearRect(0, 0, 500, 500);
      lego.drawImage(img, [0, 0]);
    } catch (err) {
      console.error(err);
    }
  };

drawImg();

