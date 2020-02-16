canvas = document.getElementById('canvas');

context = canvas.getContext('2d');

const lego = new legra(context, 32, {color: 'blue'});



lego.line(11, 11, 1, 1, { color: 'red' });

