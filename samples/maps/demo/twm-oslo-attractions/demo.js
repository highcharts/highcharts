const museumIcon = 'url(data:image/png;base64,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)',
    treeIcon = 'url(data:image/png;base64,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)',
    buildingIcon = 'url(data:image/png;base64,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)',
    eatIcon = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAABhWlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV/TiqIVh3YQ6ZChOlkQFRFctApFqFBqhVYdTC79giYNSYqLo+BacPBjserg4qyrg6sgCH6AuLo4KbpIif9LCi1iPDjux7t7j7t3gNCoMNUMjAGqZhnpRFzM5lbF7lcEEEIfIpiRmKnPpVJJeI6ve/j4ehfjWd7n/hz9St5kgE8knmW6YRFvEE9tWjrnfeIwK0kK8TnxqEEXJH7kuuzyG+eiwwLPDBuZ9DxxmFgsdrDcwaxkqMSTxFFF1ShfyLqscN7irFZqrHVP/sJgXltZ5jrNCBJYxBJSECGjhjIqsBCjVSPFRJr24x7+IcefIpdMrjIYORZQhQrJ8YP/we9uzcLEuJsUjANdL7b9MQx07wLNum1/H9t28wTwPwNXWttfbQDTn6TX21r0CBjYBi6u25q8B1zuAINPumRIjuSnKRQKwPsZfVMOCN0CvWtub619nD4AGeoqeQMcHAIjRcpe93h3T2dv/55p9fcDn79yuSKdzJkAAAAGYktHRAD/AP8A/6C9p5MAAAAJcEhZcwAAAdgAAAHYAfpcpnIAAAAHdElNRQfnBBMMEw1m/RtgAAAVxUlEQVR42u2dd3xU15XHv/e9mdFUCWlUGHWEBAJUqMK2DIga0+zYcex1SHZjZ7Nel6zjOA7rQsd2iJ1d23GCk2xIsQlZdmMbjLy2waYXUQUSCNSQUENdMyONRlPe2z9ky1EkQAgJ2Xw4/8znM3fee/f+3jnnnvO7954RDJFsm/6iahofhj56GIEJ4ViiQzGGBqIPMqM16tHotN1+7/N48brcuO2tuBocOCsbcJTW4a5soS23nkV7nhVDMY7r9tD3YlaoUoiM7ftpRE9PITjehqzVIOs0CEkCQFVVUFVUlc5P1M86KUAIhOCzz85uq4qC3+PD7/XRXFZD5Z58an57CqXJz9crVokbAsD3M19QbUtSibxtDNbEKHQmQ1eb4vPTWtdMa20TrdWNtNU046pqwV1lp6PMifesCwBtspGAeAv6qCCMUcMw2YIxR1oxR4RgDg9G0shd9/S0tdNYXEX1gQJqNuaxeP9z4isJ4AcLX1bjHspg5NzJ6EwGhCRQFQWv24Ojqp7Kfaep3nQKX7UbtcGPWq9cXcfDJESojCZST+QDaUTfPo7AqDC0eh1CklAVFU9bOyXbj1K+4TALsp8WXwkAs+euU5OeyiLmlrHog8ydmuZXqD9XTuWufBr3luLa3DAoL814XyjWaQlEZ6UQNjoOSe50DW57KxWHzlD0810s3L5UfCkB3DpxjRr3w6kkLszAGBIEQIfTRd2Z8xRvPID9lxeuq3MPeiyWxCW3ET52BAEWIwCuJjvF2YcpfzWHO48vE18KAN8NXKYO+24sKT+4A2tCJEKSUHx+yvfnUbR+F+27mq/aPAdMO8IkDFnBJD2SRVxmKpJGRlUUGkuryf/Fh7T84QJ3O9aIIQNwa/pqNX7pbYy+KxOdUY+qqtTml1K4cS9NL5fwZZKQp0cyask0IlISEELgcbk5t2U/ZesOcOfJ5eK6A7gt6yV1/Ct3YxufhCRLuB1tFGzezYXVh1Gr/HwZRUTJxC7PYMx9M9AHmlD8CjW5ReT++F0W7XpGXDcAd/zLenXiM3cRHG8D4GJeCadf+wjn72v4KojlQRvjnvgaw1NHAtBcVsPxl7Yw5zePiEEHcO/yt9T0RxdgiQjB7/VR/PERCp/bgT/Pw1dJ5FQdo16YQ+K8KchaDc7aJk7+6gOmrf6OGDQA963cqI5/fCEmaxCetnZOb9rJhedzhmySGIhJJnbtVMY9MBOdyUBbo53cN7K5feUSMeAA7l3+ljrh3xZjsgbhanKQt+Fjapae5EYQ27p0Uh+ahzEkkLZGOydef7/Pmij31edN+snXMYcF42pycOKNbdQ+n8+NIq07anEYmwlNjcNkDSJ4bDSzHSNW/ulY9qprBnBb1ktqxiv3ExQdjqetnZO//fCGAu9zce1uwBXaRnj6CIzBgQSnRjHtZOjKP5d9sqrfAG5NX61O+OW9hI+Nx+/1kf/2J1Q+cZQbVVp31OKJ9xGeOgKjNQhTahhZOeErN9XuvCSI0uUyjPilt2EbnwRA8cdHuPB8zhU7oaBi2zKT4ZtuR4zXfnnQCROI0ZrPCLJLy4Xncyj++EinbxyfRPzS23g3cNklL9NcqmHYd2MZfVcmkixxMa+Ewud2XH62lcBvUJDaBC0nL5DxL4sxWcyUv7wH327XkGDmT5YImB5KcEoUwfERaPUBtFTW0Xy6CucfypEbe84Tar1C4XM7CIoNZ3jqSEbflUnjofPw+lWY8NaJa9RJL9+LJSIEt6ONY6v/ivsj++Wn82QN0a9OxzA3nKZX8vDaVMYsuBXHMA/O45WI5usHnDJKImz1eBJ/MJ3Rd91KzC1jiRybgDUhkvBx8Qyfkohxlo36yjJEqa8niHV+7B21RGaNJcBsxJwUzrT9ISs31fQ05V41MO6HU7EmRKKqKgWbd18+w9ACUTJqsx9XVRNJd2fi9fmoeyuPIouJ8Qum0dJix73uNOK8OrjIBQvke62kPTqPmNEjkbUaJKm7l9JqtWitwVgygxCrZM76slF2tfe4lfP3NRTcspvx35uPNSGSuB9OhX/sgwZmz12nTnz2LnRGA7X5pZx5+P/AeemBK7GC0GWT0CQaaP5jIboxFhLnTcEXIqj8RQ5SlJ6Jd2bRHOnBde4ion5wQFTjBNZ/T2XCowuJToxH1shd1H+vFiMERmsQtY01eD7pnZ90nKhh2NxYLMOtWGJCyTwRvPLPpTtWXVYDk57KwhgShOLzU7hx7xWJAbXKj8FsJO2x2zmke5+Sf99J7RO1pN45DUmWKXphJ4rfz6RFWeQHBFC9Yj+iYGDJBj9+wpdNZco/zENvMPT5OoPBQNCkOJycveTYCjfuJXxtPMaQIJKeyoLtl9HADxa+rKY/MR+NXkfZ3lOUPbz/8kn5HybhH67Q8qdztEarpN+dRYNowvFmAY0mJwlzJiHHGLjw+kHqfY3EZaWjJATQdrIKmgdGExVUEv4yi9S7pmMwGa/6euMwC2UvH7xke/uBZvSzrATHD8cUFkRmXsjKjUXbV/WqgXEPZaAPMtPhdFG0fteVzcavkPns/eQN/5jGV49RZjaS8q1ZHHO6aN9QRIFex8RvzMLv81P1Wg7HHU4yH1qMWCuoW52DWuC7NvRMAvPjccTPSMdoNvXrFn25rmj9LiInjkIfZCbuoQzI7kUD3898QZ28/B40AVpqcgup+OkxcF1eS7xNLRgnDWfE7Am4/K1c3JCLZYKNqBmpNLjraftdEZ44mTHzb0GONVD7s2M4QzuY8o25dMTJOEuqoab/5izPMDH2qa9hS4jt9z2KCs7R8OblMytffQeBc6IIig4nMDqMqXtMKzdVfLqqG4BPPfPDldG3jkNVVE68vBX3rpYrP/2Cj7b2epRYE6O/loFX5+X8a/sInhzNyLmTceicNL55CvdwGD0vA3+chrr1J9BPDCd52iTcw8GRXwn9YXN0EPjPSaQsykSW5X4DWJFXhP2t4ivkeSouvYO4eRPQ6LS0euz8JnvTFwC+F7NCTV46G4vNSt3ZMoof3NXnDvjyXTQWnKd9pJZRMydxsa6KurdOEjw5hhFZE2jBTsvGApSoANIXTceboMccaSUkPJSwxBjqTQ7cR2svO9P3KuESMU9nYouNviYvcHbLfjo+rr/i7zqO2Am5LwFzeDBCJzMtO2TlXxy7V0kAUoiMNTEKVVGo3HX1RIF8xEf18j0UHD3JqCXTkScGc3bthzgv1JG2ZA7h30qh7Jf7uJBfyPg5txGXmNDpgLUabv/OIizPjoNY6eq4vCwLYyamXRN4FyuqaM+p7vPvK3floyoK1sQopBD5i1zY9v00dCYDXreHxr2l/eqMJleh6oU9NJZfJO2R+ZimR5Pz7Y1U5RWT/q05DP/eZHRGfU/wNRoy/2kxln9NQr0KDG2zkhFS/9fEPB4P5fvy8OTY+3xN495SvG4POpMB2/fTvgAwenpKZ+BYVX9Ni97aHIXytZ9SVVRGyj/OxnBPNCVrduC2tzJ+0XQiEmJ6vS7AoCduWipiRN99WavXDaL/ANovNlC96QRc6Lv/dW1uwFHVae6fYyZtm/6i+vniUOW+09ccl2n2+6hcvpO8nOPc+oN7CLx/NK1uF3q9Hq22d3bG7/PTVtsMJX2fkVXps81I/ZD21jaO/NcHiOyrJzk+xyg43sa26S+qkml8GLJWg+LzU73p1IAEt5qjCvUvHqTsdCGzH76X2JEjLj8gZyulmw9fnQ9U1Mumapd8lqudI5u30/FCWb/GVr3pFIrPj6zVYBofhqSPHoas09Ba14yv2j1g6ZX2qMLFX+dQcCgXxX8FzVJUFLv3qu5vMVngKhXQYXdw4p1PaVx7vHPLXD/EV+2mta4ZWadBHz0MKTAhHCFJtNY2oTYMcI76jp3CZf/H0U8unxJqTXpiHpyCfGvf8lgVFb9Z02cXqKoqrXYHh36zhdo1hxHl/U8j1QY/rbVNCEkiMCEcjSU6tNMpVzcOyvKk2N1BlX8PlZGRRI4ZgSTL+Hw+fB1eVFT0RgN6g4HJ98zhUIeX2pYjlyUb1GiB8fFRpMyc2rUx85KKrSh0uNopOn6aik05eN+qQ7RfI+tTr9Ba3QgTwBIdisYYGoiqqrTVDB7jKfZ1kPv8uziemIHFZqXxfDX1R0rw+LykfXs2MaMSkGSJlDun4fF5aXotF+lUTxBFnEzo0nRSvzkTc5ClKxxxNDQjCUGH19uZlfgVvC43juoGSrKP4vljNVLzwO1qa6tpRlVVjKGBaPRBZlBVXFUtDKb43ndQkL8NNUJGOu5F8nQO6ETFe/iXLiY+OYnAwEAmf2M2ZdHDKVq+HZHzxW4HRasSvDSFiUvmdREA3g4PuR/soenjc0hC4Ha5kQM04FHwFDtRD3QgIZAGeBukq6oFVBV9kBmN1qhHVcFdZWewRT6vwnkff7uer2xu5qxpO4afGImIjcJssTB2VgaKUCld/Qkc7ECkaDE/PJqpS+Z3gef3+dm5cSuuV/LhnP9v6K3PtBX6PVFcSdxVdlSVzs3wGp0WVJWOMueQLPzghvb1NeSaskl/bCERMZFIkkTa7FvR6HWU/Ho30fdOJPWOzK6d+x0dHRTuPd4DvOslHWVOUFU0Om0nH6iidm3oHgoRQPsrFRyTtjHz2SUYLZ1bg8dmTiIoMozA0OAu8Hw+H2d2H6Fs+aeIc0Ozjc571oWKikAg8SUS74YqctZv4WLNxa7vokbEYrFYumbVszm5VP3qIOKI90vRZ4nPfIU22Tj0vWlQaXnjHMUfHKKjo6NHc331RYpe+hjf+44h7aY22djlXyWfxwtCEBBv+VK8UX2WlaBEG4rSMyZVfH7MKeGoQ9zHgHgLCIHP40XyutwIAfqooCEHzzNHy8RldzP29skYellds8XHMOEHiwhalth1imlIXnJUEEKA1+VGcttbQQiMUcOGFDzlm2Zu+8V3iEiK7UbRK36lG+sSGjWcxG9PR340AkKG5HhcJ1ZC4La3IrkaHAghMNmCh8wLax4KZera+4ke1Z21abM7eW/5m+TuPNiNkIhNHEH6k4sJ+tHoIQHRZAtGCIGrwYHkrOwkUM2RVkTY9Z+UA56IYtyPFhCVGN/te2eznQPr30P6aQ3Fq7dTdPx0N02MS4hnyqOLMT45Er/2+m0xFmES5khrZx8rG5AcpXWoioI5IgQRKl+3jqiA9WcpZPzobkaMSerW1upwcuztj2j7VedqmXavj6JXtlOWX9hdEwItpH93HpY1yRBzfV6+CJUxR4SgKgqO0jokd2ULfo8Pc3gwmkj99UHPJtAtjSb5gSyskRHdJxJ3ByU7j9P803yo+kKzfP/bQt6KLZw7kd+liUIIwm3DmfbYvYQsTYPIwTdnTaQec3gwfo8Pd2ULUltuPX6vD0kjE/lA2uBrngWCnkhm8uN3Evb34HV4OPDfH1Lyze2Iiz1nWeV9J4Wvb+fi+YovNEIIDEYDmd+/i+AV41GTB9eKIh9IQ9LI+L0+2nLrkRbteVY0l3VuX4u+fdygPtwvFEzPjybtu/OIiLR1ZzhcLvI+2k/zz08g+S+hSQr4NzZR+PZu6iq6L0fKGg23fmchI16aiTx18Czpc4yay2pYtOdZIQFU7ulcCw6MCsN4X+jg+I4xGmy/u4WMhxZiDev+DJ/Xy7m9xyl/YQ/i9BXyWz80rTrH0Ve30tLY1K1JFxBAyvxMQp+cDEkDr4nG+0IJjArjbzGTAGp+ewpPWztavQ7rtISBN9sxMtYn05nwzdkMC+keLnm9XgqP5lG+bjfS0b5tNhIIPL+v5tgb71NRVt5tdtZoNWTcM4fAFRORZw5semqdloBWr8PT1k7Nb099AaDS5KexuAohSURnpQys5t0SQOhPJpHyjSwMxp4DKjx6ioJntsHuq1zQsqs4/rOY029/irOlO5cpyzJZ9y8iacU8yBo4c47OSkFIEo3FVShN/i8A/HrFKlF9oABVUQkbHUfQY7ED8kAlTSZp9Twm3zuHYcN6ZjqVZ0sp+/Ve5L39Y1aEE9r/6zyn/mcnPk/3e0iSxMhb0ohZOh11RsA1jyXosVjCRsehKirVBwq6ilp0BU81G/PwtLUjyRKJS2679qB6ipb4F2eRnDUZg7FnXltXXsXxn23B+9fGa9PwCpWGNSfY+bt3UPzdA2qtVkv6zFtI/Y97kBf1nywRYZ2YSLLUab4b87rTWQCL9z8nSrZ3HqIJHzsCQ1b/UzvtAgtxa2Yzcf70rroFfytNNXXkbdiO8scmGAget1rF9Z8FHNvyKZ6/o8E0Wi0j08cwYd29qIuM/aIgDFnBhI/tTDNLth/tVgmk2+jKNxzGbW8lwGIk6ZGs/qW2C82MWbGQCXMze22vq77Inhc34Vw7sCfa1RI/Fcv3kvvhPrx/Z85CCIYnxpL8/Hy0/2QF89UF3EmPZBFgMeK2t1K+4XBPQvVzWZD9tKg4dKYz18xMJeTpkVf1IHmWibHP3EH8xDG9tre2ODj9px3wdiODIVKBQvXLB6g5U9pj34xGoyFpQgqR385AxGv6fM+Qp0cSl5kKQMWhMz3Kp/Swr6Kf78LVZEfSyIxaMg0R1fd4ShdlYlhUeI+zGQDNjU3sfn0z9tcKwTGIXN5BD8cf/x9O7DzQg5SVZRm9xYjQ9U0DRVQnBpJGxtVkp+jnu3ojk7rLwu1LRXH2YVRFISIlgdjlGX3ue9vWWs7vPYnT3p1yd9odnNm6r3NDT911IEIPdlC+didnc3K7gXjxQhUlG/agnOrb6frY5RlEpCSgKgrF2Yd7rTnT61Rb/moOjaXVCCEYc98MLA/a+mZCdkHZQ3s48Mdt1NXVdZqt08nxv2ynYc1xJN/14+7EoQ7K1u+h+ux5FEWhqqyCwj/vxv+/DdCHeN3yoI0x981ACEFjaTXlr/Z+0LJX+9xUs3PVAjF2ZeSMzrNixhEh1Ow/g1p35WVEWZHw5DfQYnBg13go++gYza/mQ+l1XoL0gz+/nbra8zQ6Gji/8SCu31f06XyKnKpj/Lq7GRYbgcfl5tiL73DHe0+K3rOiS8i7gcvUkW/OYNx9M5FkiXPZBzn7vQ+/svURribmS/7dHYxeeCuKX+H05p2U/OvuSxbouWS0fLdjjShbd4Ca3CIAEudNIXbtVG50iV07lcR5UzqTi9wiytYduGx1o8umG3eeXC5yf/wuzWU1yFoN4x6YiW1d+g0Lnm1dOuMemIms1dBcVkPuj9+9YlWjK8Yofy77ZNXc9sSVYRkJGIMDCUmOxmFsxrW74YYCL2zFGNIfno8+yIyztomja97hjr8+ecVZr09B3p+OZa9aYExdaU3rrGoRmhqHK7SN1h21N4zmpT88v6vsSe4b2cz8j+/1KWS4WXjnehXe+Vxuln66RgDhZvGxawYQbpa/u2YA4WYBxmsG8POM5WYJ0AGQm0VoB0hulkEeILlZiHuA5GYp+AGSm39GMMByo/wdxv8DluP0ikXtk3EAAAAASUVORK5CYII=)';


// Create the chart
Highcharts.mapChart('container', {
    chart: {
        margin: 0
    },

    title: {
        text: ''
    },

    subtitle: {
        text: ''
    },

    navigation: {
        buttonOptions: {
            align: 'left',
            x: -1,
            height: 28,
            width: 28,
            symbolSize: 14,
            symbolX: 14.5,
            symbolY: 13.5,
            theme: {
                'stroke-width': 1,
                stroke: 'silver',
                padding: 10
            }
        }
    },

    mapNavigation: {
        enabled: true,
        buttonOptions: {
            x: 10
        }
    },

    mapView: {
        center: [10.73028454146517, 59.91261204279989],
        zoom: 13,
        fitToGeometry: {
            type: 'MultiPoint',
            coordinates: [
                [10.55, 59.95],
                [10.9, 59.87]
            ]
        }
    },

    tooltip: {
        pointFormat: '{point.name}'
    },

    legend: {
        enabled: true,
        align: 'center',
        symbolWidth: 20,
        symbolHeight: 20,
        itemStyle: {
            textOutline: '1 1 1px rgba(255,255,255)'
        },
        backgroundColor: 'rgba(255,255,255,0.9)',
        float: true,
        borderWidth: 1,
        borderRadius: 5
    },

    plotOptions: {
        mappoint: {
            dataLabels: {
                enabled: false
            }
        }
    },

    series: [{
        type: 'tiledwebmap',
        name: 'Basemap Tiles',
        provider: {
            type: 'OpenStreetMap'
        },
        showInLegend: false
    }, {
        type: 'mappoint',
        name: 'Museums in Oslo',
        marker: {
            symbol: museumIcon,
            width: 24,
            height: 24
        },
        data: [{
            name: 'Fram Museum',
            geometry: {
                type: 'Point',
                coordinates: [10.692997228, 59.901996392]
            }
        }, {
            name: 'Vigeland Museum',
            geometry: {
                type: 'Point',
                coordinates: [10.70013, 59.92285]
            }
        }, {
            name: 'Norwegian Museum of Cultural History',
            geometry: {
                type: 'Point',
                coordinates: [10.6849055937, 59.9041430501]
            }
        }, {
            name: 'The Viking Ship Museum (Vikingskipshuset)',
            geometry: {
                type: 'Point',
                coordinates: [10.684461, 59.904756]
            }
        }, {
            name: 'Museum of Cultural History',
            geometry: {
                type: 'Point',
                coordinates: [10.735472, 59.916806]
            }
        }, {
            name: 'The Astrup Fearnley Museum of Modern Art',
            geometry: {
                type: 'Point',
                coordinates: [10.720863, 59.907062]
            }
        }, {
            name: 'Munch Museum',
            geometry: {
                type: 'Point',
                coordinates: [10.755656, 59.906169]
            }
        }, {
            name: 'Natural History Museum at the University of Oslo',
            geometry: {
                type: 'Point',
                coordinates: [10.7717, 59.9198]
            }
        }]
    }, {
        type: 'mappoint',
        name: 'Parks in Oslo',
        marker: {
            symbol: treeIcon,
            width: 24,
            height: 24
        },
        data: [{
            name: 'The Vigeland Park',
            geometry: {
                type: 'Point',
                coordinates: [10.705147, 59.924484]
            }
        }, {
            name: 'Frogner Park',
            geometry: {
                type: 'Point',
                coordinates: [10.703473, 59.926458]
            }
        }, {
            name: 'The University\'s Botanical Garden',
            geometry: {
                type: 'Point',
                coordinates: [10.7699, 59.9174]
            }
        }]
    }, {
        type: 'mappoint',
        name: 'Great buildings in Oslo',
        marker: {
            symbol: buildingIcon,
            width: 24,
            height: 24
        },
        data: [{
            name: 'The Norwegian National Opera & Ballet',
            geometry: {
                type: 'Point',
                coordinates: [10.751825, 59.90766]
            }
        }, {
            name: 'Akershus Fortress',
            geometry: {
                type: 'Point',
                coordinates: [10.736011, 59.907667]
            }
        }, {
            name: 'Royal Palace in Oslo',
            geometry: {
                type: 'Point',
                coordinates: [10.7275, 59.916944]
            }
        }, {
            name: 'Oslo City Hall',
            geometry: {
                type: 'Point',
                coordinates: [10.733583, 59.911764]
            }
        }, {
            name: 'Akrobaten bru',
            geometry: {
                type: 'Point',
                coordinates: [10.759654, 59.909714]
            }
        }]
    }, {
        type: 'mappoint',
        name: 'Restaurants in Oslo',
        marker: {
            symbol: eatIcon,
            width: 24,
            height: 24
        },
        data: [{
            name: 'Elias mat & sånt',
            geometry: {
                type: 'Point',
                coordinates: [10.738687049524728, 59.9163183916486]
            }
        }, {
            name: 'Østbanehallen renovated train station & food court',
            geometry: {
                type: 'Point',
                coordinates: [10.751095761430776, 59.91085233408226]
            }
        }]
    }]
});
