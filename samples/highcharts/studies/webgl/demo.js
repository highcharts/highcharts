/* global THREE */
$(function () {

    (function (H) {

        var Color = H.Color,
            extend = H.extend;

        function WebGLElement() {
            this.init.apply(this, arguments);
        }
        extend(WebGLElement.prototype, {
            init: function (renderer, mesh) {
                this.renderer = renderer;
                this.mesh = mesh;
            },
            add: function () {
                this.renderer.scene.add(this.mesh);
                this.renderer.draw();
                return this;
            },
            attr: function (attribs) {
                if (attribs.fill) {
                    var rgba = new Color(attribs.fill).rgba;
                    this.mesh.material.color.setRGB(rgba[0] / 255, rgba[1] / 255, rgba[2] / 255);
                }
                return this;
            }

        });

        function WebGLRenderer() {
            this.init.apply(this, arguments);
        }
        extend(WebGLRenderer.prototype, {
            init: function (container, width, height) {
                this.scene = new THREE.Scene();
                this.width = width;
                this.height = height;


                this.camera = new THREE.PerspectiveCamera(50, width / height, 1, 10000);
                this.camera.position.z = 500;
                this.scene.add(this.camera);

                this.THREErenderer = new THREE.WebGLRenderer();
                this.THREErenderer.setSize(width, height);
                container.appendChild(this.THREErenderer.domElement);
            },

            rect: function (x, y, width, height) {
                var geometry = new THREE.CubeGeometry(width, height, 0),
                    material = new THREE.MeshBasicMaterial(),
                    mesh = new THREE.Mesh(geometry, material);

                mesh.position.x = x - (this.width + width) / 2;
                mesh.position.y = y + (this.height - height) / 2;

                return new WebGLElement(this, mesh);
            },
            draw: function () {
                this.THREErenderer.render(this.scene, this.camera);
            }


        });
        H.WebGLRenderer = WebGLRenderer;
    }(Highcharts));

    var renderer = new Highcharts.WebGLRenderer(
        document.getElementById('container'),
        600,
        400
    );

    renderer.rect(10, 10, 50, 100)
        .attr({ fill: Highcharts.getOptions().colors[0] })
        .add();
    renderer.rect(100, 10, 50, 200)
        .attr({ fill: Highcharts.getOptions().colors[2] })
        .add();

});