/* global THREE */
$(function () {

    function WebGLElement() {
        this.init.apply(this, arguments);
    }
    Highcharts.extend(WebGLElement.prototype, {
        init: function (renderer, mesh) {
            this.renderer = renderer;
            this.mesh = mesh;
        },
        add: function () {
            this.renderer.scene.add(this.mesh);
            this.renderer.draw();
            return this;
        }
    });

    function WebGLRenderer() {
        this.init.apply(this, arguments);
    }
    Highcharts.extend(WebGLRenderer.prototype, {
        init: function (container, width, height) {
            this.scene = new THREE.Scene();


            this.camera = new THREE.PerspectiveCamera(50, width / height, 1, 10000);
            this.camera.position.z = 500;
            this.scene.add(this.camera);

            this.THREErenderer = new THREE.WebGLRenderer();
            this.THREErenderer.setSize(width, height);
            container.appendChild(this.THREErenderer.domElement);
        },

        rect: function (x, y, width, height) {
            var geometry = new THREE.CubeGeometry(width, height, 200),
                material = new THREE.MeshNormalMaterial();

            return new WebGLElement(
                this,
                new THREE.Mesh(geometry, material)
            );
        },
        draw: function () {
            this.THREErenderer.render(this.scene, this.camera);
        }


    });
    Highcharts.WebGLRenderer = WebGLRenderer;

    var renderer = new WebGLRenderer(
        document.getElementById('container'),
        600,
        400
    );

    renderer.rect(100, 100, 100, 100)
        .add();

});