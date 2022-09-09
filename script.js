var oranges = false;
// module aliases
let Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,  
    Events = Matter.Events,
    Body =   Matter.Body,
    Composite = Matter.Composite;


class Sketch{
	constructor(){
		// create an engine
		this.engine = Engine.create();
		this.width= window.innerWidth;
		this.height= window.innerHeight;
		// create a renderer
		this.render = Render.create({
		    element: document.body,
		    engine: this.engine,
			options: {
				width: this.width,
				height: this.height,
				showAngleIndicator: true
			}
		});

		// create two boxes and a ground
		this.createBodies();
		this.createWall();
		
		this.setupMouse();
		// run the renderer
		Render.run(this.render);
		
		// create runner
		var runner = Runner.create();
		
		// run the engine
		Runner.run(runner, this.engine);
		
		window.addEventListener("resize", ()=>{this.onResize()});
		Events.on(runner, "afterTick",()=> {this.updateHtmlElems();})
	}
	
	updateHtmlElems(){
		if(this.htmlBods){
			this.htmlBods.map((bod)=>{
				bod.update();
			});
		}
	}
	
	onResize(){
		this.width = window.innerWidth;
		this.height= window.innerHeight;
		
		this.render.options.height = this.height;
		this.render.options.width = this.width;
		this.render.canvas.height = this.height;
		this.render.canvas.width = this.width;
		
		Composite.clear(this.engine.world,false);
		
		// create two boxes and a ground
		this.createBodies();
		this.createWall();
		this.setupMouse();
		
	}
	
	setupMouse(){
		// add mouse control
	    var mouse = Matter.Mouse.create(this.render.canvas),
		   mouseConstraint = Matter.MouseConstraint.create(this.engine, {
			  mouse: mouse,
			  constraint: {
				 stiffness: 0.1,
				 render: {
					visible: false
				 }
			  }
		   });

	    Composite.add(this.engine.world, mouseConstraint);

	    // keep the mouse in sync with rendering
	    this.render.mouse = mouse;

	}

	createWall(){
		var wall1=   Bodies.rectangle(this.width/2, this.height, 1,1, { isStatic: true });
		Body.scale(wall1,this.width, 60);
		var wall2=   Bodies.rectangle(this.width/2, -30, 1,1, { isStatic: true });
		Body.scale(wall2,this.width, 60);
		var wall3=   Bodies.rectangle(this.width-30, this.height/2,1,1, { isStatic: true });
		Body.scale(wall3,60, this.height);
		var wall4=   Bodies.rectangle(-30, this.height/2,1,1, { isStatic: true });
		Body.scale(wall4,60, this.height);
		this.walls = [];
		this.walls.push(wall1);
		this.walls.push(wall2);
		this.walls.push(wall3);
		this.walls.push(wall4);
		Composite.add(this.engine.world, this.walls);
		
	}
	createBodies(){
		
		var htmlElems = [...document.querySelectorAll(".physicsDiv")];
		
		var bodies = [];
		this.htmlBods = [];
		htmlElems.map(elem=>{
			elem.style.transform = "";
			elem.style.webkitTransform = "";
			elem.style.msTransform = "";
			
			elem.classList.remove("abs");
			var b = elem.getBoundingClientRect();
			elem.classList.add("abs");
			
			var bod = Bodies.rectangle(b.left+(b.width/2), b.top+(b.height/2), 1,1);
			bod.htmlElementOffset = {top:b.top,left:b.left};
			Body.scale(bod,b.width, b.height);
			bod.frictionAir = 0.5;
			//Body.setDensity(bod, 10);
			bod.htmlElement = elem;
			
			bod.update = ()=>{
				
				elem.classList.remove("abs");
				var b = elem.getBoundingClientRect();
				elem.classList.add("abs");
				
				var xpos = bod.position.x;
				var ypos = bod.position.y;
				
				var angle = bod.angle;
				// 
				var transform = "translate("+(elem.offsetWidth/-2)+"px, "+(elem.offsetHeight/-2)+"px) translate("+xpos+"px, "+ypos+"px) rotate("+angle+"rad) scale3d(1,1,1)";
				//translate("+(elem.offsetWidth/-2)+"px, "+(elem.offsetHeight/-2)+"px)  
				//aconsole.log(transform);
				
				var sinAng = 2*Math.sin(bod.angle);
				var cosAng = 2*Math.cos(bod.angle);
				
				Body.applyForce(bod,bod.position,Matter.Vector.mult( Matter.Vector.sub(Matter.Vector.create(this.width/3,this.height),bod.position),0.0001));
				
				elem.style.boxShadow = ""+sinAng+"px "+cosAng+"px 1px 1px #0002";
				elem.style.transform = transform;
				elem.style.webkitTransform = transform;
				elem.style.msTransform = transform;
			};
			
			this.htmlBods.push(bod);
			//var bod = Bodies.rectangle(this.width/2, this.height, this.width, 60, { isStatic: true });
			bodies.push(bod);
		});
		
		
		// add all of the bodies to the world
		Composite.add(this.engine.world, bodies);

	}
	
	
}
var sketch = null;

document.addEventListener("DOMContentLoaded",()=>{
	sketch = new Sketch();
})
