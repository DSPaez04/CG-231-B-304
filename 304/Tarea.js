

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(WIDTH, HEIGHT);
renderer.setClearColor(0xDDDDDD, 1);
document.body.appendChild(renderer.domElement);

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 1, 1000);
camera.position.z = 35;
camera.position.x = -5.2;
camera.position.y = 2;

camera.rotation.set(0, -0.5, 0);
scene.add(camera);

var controls = new THREE.OrbitControls(camera, renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Agregar luz direccional
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);




const size = 150;
const divisions = 160;
const axesHelper = new THREE.AxesHelper(1000);
scene.add(axesHelper);

const gridHelper = new THREE.GridHelper(size, divisions);
scene.add(gridHelper);


function poligono(nlados, dim) {
  const vertices = [];
  const ang = 2*Math.PI/nlados;
  radio = dim/2/Math.sin(ang/2);
  for (i=0; i<=nlados; i++) {
      const x = radio*Math.cos(i*ang);
      const y = radio*Math.sin(i*ang);
      vertices.push([x, y]);
  }
  return vertices;
}
function crearTroncoPiramide(lados, altura, dimBaseInferior, dimBaseSuperior) {
  const verticesBaseInferior = poligono(lados, dimBaseInferior);
  const verticesBaseSuperior = poligono(lados, dimBaseSuperior);

  const vertices = [];

  // Agregar los vértices de la base inferior
  vertices.push(...verticesBaseInferior.map(([x, y]) => [x, 0, y]));

  // Agregar los vértices de la base superior
  vertices.push(...verticesBaseSuperior.map(([x, y]) => [x, altura, y]));

  // Agregar el vértice central de la cara inferior
  vertices.push([0, 0, 0]);

  // Agregar el vértice central de la cara superior
  vertices.push([0, altura, 0]);

  // Construir las caras del tronco de pirámide
  const caras = [];

  for (let i = 0; i < lados; i++) {
    const a = i;
    const b = (i + 1) % lados;
    const c = i + lados;
    const d = ((i + 1) % lados) + lados;

    // Agregar las caras laterales
    caras.push(a, b, c);
    caras.push(b, d, c);

    // Agregar las caras que conectan con el vértice central de la base inferior
    caras.push(a, (a + 1) % lados, lados);
    
    // Agregar las caras que conectan con el vértice central de la base superior
    caras.push(c, (d + 1) % (2 * lados), 2 * lados + 1);
  }

  // Agregar la cara inferior
  for (let i = 0; i < lados - 2; i++) {
    caras.push(lados, i, i + 1);
  }

  // Agregar la cara superior
  for (let i = 0; i < lados - 2; i++) {
    caras.push(2 * lados + 1, lados + 1 + i, lados + 2 + i);
  }

  const geometry = new THREE.BufferGeometry();
  const positionAttribute = new THREE.Float32BufferAttribute(vertices.flat(), 3);
  const indexAttribute = new THREE.Uint32BufferAttribute(caras, 1);

  geometry.setAttribute('position', positionAttribute);
  geometry.setIndex(indexAttribute);

  const material = new THREE.MeshToonMaterial({ color: 0x000000, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(geometry, material);

  return mesh;
}

// Función para crear un polígono regular
function poligono(nlados, dim) {
  const vertices = [];
  const ang = (2 * Math.PI) / nlados;
  const radio = dim / 2 / Math.sin(ang / 2);
  for (let i = 0; i < nlados; i++) {
    const x = radio * Math.cos(i * ang);
    const y = radio * Math.sin(i * ang);
    vertices.push([x, y]);
  }
  return vertices;
}

// Llamar a la función para crear el tronco de pirámide
const lados = 5;
const altura = 10;
const dimBaseInferior = 5;
const dimBaseSuperior = 3;

const troncoPiramide = crearTroncoPiramide(
  lados,
  altura,
  dimBaseInferior,
  dimBaseSuperior
);


// Agregar el tronco de pirámide a la escena o hacer cualquier otro procesamiento necesario
scene.add(troncoPiramide);



//Renderizado de la animación
function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

render();


