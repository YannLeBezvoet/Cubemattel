export function createCubeNode(id, targetInput) {
  const PIXI = window.PIXI;
  const container = new PIXI.Container();
  const cubeShape = new PIXI.Graphics();
  const halo = new PIXI.Graphics();
  const figure = new PIXI.Graphics();
  const prop = new PIXI.Graphics();
  const plate = new PIXI.Graphics();
  const label = new PIXI.Text("", {
    fontFamily: "Arial",
    fontSize: 12,
    fill: 0xedf4ff,
    fontWeight: "700",
  });
  const mood = new PIXI.Text("", {
    fontFamily: "Arial",
    fontSize: 11,
    fill: 0xbdd2f5,
  });

  label.anchor.set(0.5, 0);
  mood.anchor.set(0.5, 0);
  label.y = 58;
  mood.y = 74;

  container.addChild(plate, halo, cubeShape, figure, prop, label, mood);
  container.eventMode = "static";
  container.cursor = "pointer";
  container.on("pointertap", () => {
    targetInput.value = id;
    targetInput.focus();
  });

  return {
    id,
    container,
    cubeShape,
    halo,
    figure,
    prop,
    plate,
    label,
    mood,
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    phase: Math.random() * Math.PI * 2,
    cube: null,
  };
}

export function drawCube(node, cube) {
  const cubeColor = Number.isInteger(cube.color) ? cube.color : 0xcccccc;
  const cubeFillColor = 0x9aa3b2;
  node.cubeShape.clear();
  node.cubeShape.lineStyle(3, cubeColor, 1);
  node.cubeShape.beginFill(cubeFillColor, 1);
  node.cubeShape.drawRect(-40, -40, 80, 80);
  node.cubeShape.endFill();

  const upsideDown = cube.orientation === "upside_down";
  node.figure.scale.y = upsideDown ? -1 : 1;
  node.figure.position.set(0, upsideDown ? 10 : -10);

  node.figure.clear();
  node.figure.lineStyle(3, 0x000000, 1);
  node.figure.drawCircle(0, -15, 6);
  node.figure.moveTo(0, -9);
  node.figure.lineTo(0, 5);
  node.figure.moveTo(-8, -3);
  node.figure.lineTo(8, -3);
  node.figure.moveTo(-4, 5);
  node.figure.lineTo(-4, 15);
  node.figure.moveTo(4, 5);
  node.figure.lineTo(4, 15);
  node.figure.lineStyle(2, 0x000000, 1);
  node.figure.drawCircle(-2, -17, 1);
  node.figure.drawCircle(2, -17, 1);

  node.plate.clear();
  node.prop.clear();
  node.halo.clear();
  node.plate.beginFill(cubeFillColor, 0.16);
  node.plate.drawRoundedRect(-46, -46, 92, 92, 12);
  node.plate.endFill();
  node.halo.lineStyle(4, cubeColor, 0.2);
  node.halo.drawRoundedRect(-49, -49, 98, 98, 14);
  node.label.text = cube.playerName;
  node.mood.text = `${cube.character} - ${cube.emotion}`;
}
