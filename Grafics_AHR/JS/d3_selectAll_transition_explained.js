var width = 960,
    height = 500,
    delay = 1000,
    duration = 1000,
    circleInitialPosition = 200,
    circleCount = 7,
    circleSpacing = width/(circleCount+1),
    circleMovingIncrement = 30,
    data = d3.range(circleCount),
    explanations = _makeExplanations(),
    explanationArea = d3.select(".explanation-area");

var svg = d3.select("body").insert("svg", ".top-container")
  .attr("width", width)
  .attr("height", height);

_goToStage(0);

function _playStage0() {

  svg.selectAll("circle")
    .data(data)
    .enter().append("circle")
      .attr("transform", function(d,i) { return "translate(" + circleSpacing*(i+1) + "," + circleInitialPosition + ")" ;})
      .attr("r", 10)
      .style("stroke", '#000');
}

function _playStage1() {
  
  svg.selectAll("circle")
    .transition("playStage1")
      .attr('r', 15)
      .style('stroke', 'green')
      .ease('bounce')
      .duration(duration);
}

function _rewindStage1() {
  
  svg.selectAll('circle')
    .transition("playStage1")
      .duration(0)

  
  svg.selectAll("circle")
    .transition("rewindStage1")
      .attr('r', 10)
      .style("stroke", '#000');
}

function _playStage2() {
  
  var drawnTransitions = svg.selectAll(".drawn-transition")
    .data(data)
    .enter().append("g")
      .classed("drawn-transition", true)
      .attr("transform", function(d,i) { return "translate(" + circleSpacing*(i+1) + "," + circleInitialPosition + ")" ;})
  var tails = drawnTransitions.append("path")
    .classed("tail", true)
    .attr("d", d3.svg.symbol().size(20))
    .style("fill", 'grey')
    .style("stroke", 'grey');
  var bodies = drawnTransitions.append("line")
    .classed("body", true)
    .attr({x1: 0, y1: 0, x2: 0, y2: 0})
    .attr("stroke-dasharray", "5")
    .style("stroke", 'grey');
  var heads = drawnTransitions.append("path")
    .classed("head", true)
    .attr("d", d3.svg.symbol().type("triangle-down").size(40))
    .style("fill", 'grey')
    .style("stroke", 'grey');
  var starts = drawnTransitions.append("text")
    .classed("start-time", true)
    .attr("transform", function (d, i) { return "translate(-10, " + (circleMovingIncrement*(i+1) + 15) + ")"; })
    .text(function(d, i) {return "start: " + i + "s"})
    .attr("text-anchor", "end")
    .attr("font-size", "13px")
    .style("fill", 'grey')
    .attr("fill-opacity", 0)
    .style("stroke", 'green')
    .attr("stroke-width", 2)
    .attr("stroke-opacity", 0);
  var ends = drawnTransitions.append("text")
    .classed("end-time", true)
    .attr("transform", function (d, i) { return "translate(-10, " + (circleMovingIncrement*(i+1) + 30) + ")"; })
    .text(function(d, i) {return "end: " + (2*i+1) + "s"})
    .attr("text-anchor", "end")
    .attr("font-size", "13px")
    .style("fill", 'grey')
    .attr("fill-opacity", 0)
    .style("stroke", 'red')
    .attr("stroke-width", 2)
    .attr("stroke-opacity", 0);

  
  bodies.transition("playStage2")
    .attr("y2", function(d, i) { return circleMovingIncrement*(i+1); })
    .duration(duration);
  heads.transition("playStage2")
    .attr("transform", function (d, i) { return "translate(0, " + circleMovingIncrement*(i+1) + ")"; })
    .duration(duration);
  starts.transition("playStage2")
    .attr("fill-opacity", 1)
    .duration(duration);
  ends.transition("playStage2")
    .attr("fill-opacity", 1)
    .duration(duration);

  
  var executedBodies = drawnTransitions.append("line")
    .attr("class", "executed-body")
    .attr({x1: 0, y1: 0, x2: 0, y2: 0})
    .style("stroke", 'grey');
}

function _rewindStage2() {
 
  svg.selectAll('.drawn-transition')
    .transition("playStage2")
      .duration(0)

 
  svg.selectAll(".drawn-transition")
    .transition("rewindStage2")
      .style("fill-opacity", 0)
      .style("stroke-opacity", 0)
      .remove();
}

function _playStage3() {
  
  svg.selectAll('circle')
    .transition("playStage3")
      .attr('cy', function(d, i) { return circleMovingIncrement*(i+1); })
      .delay(function(d, i) { return delay*(i); })
      .duration(function(d, i) { return duration*(i+1); })
      .ease('linear')

  
  var drawnTransitionAnimations = svg.selectAll(".drawn-transition")
    .transition("playStage3")
      .delay(function(d, i) { return delay*i; })
      .duration(function(d, i) { return duration*(i+1); })

  
  drawnTransitionAnimations.each(function (d, i) {
    d3.select(this).select(".executed-body")
      .transition("playStage3")
        .attr("y2", circleMovingIncrement*(i+1))
        .ease('linear')
  })
  drawnTransitionAnimations.each(function (d, i) {
    d3.select(this).select(".body")
      .transition("playStage3")
        .attr("y1", circleMovingIncrement*(i+1))
        .ease('linear')
  })

  
  drawnTransitionAnimations.each('start', function () {
    d3.select(this).select('.start-time')
      .attr("stroke-opacity", 1)
      .transition("playStage3")
        .attr("stroke-opacity", 0)
  })

  
  drawnTransitionAnimations.each('end', function () {
    d3.select(this).select('.end-time')
      .attr("stroke-opacity", 1)
      .transition("playStage3")
        .attr("stroke-opacity", 0)
  })
}

function _rewindStage3() {
 
  svg.selectAll('circle')
    .transition("playStage3")
      .duration(0)

  svg.selectAll('.drawn-transition')
    .transition("playStage3")
      .duration(0)

  svg.selectAll('.executed-body')
    .transition("playStage3")
      .duration(0)

  svg.selectAll('.body')
    .transition("playStage3")
      .duration(0)

  svg.selectAll('.start-time')
    .transition("playStage3")
      .duration(0)

  svg.selectAll('.end-time')
    .transition("playStage3")
      .duration(0)

  svg.selectAll('circle')
    .transition("rewindStage3")
      .attr('cy', 0);

  svg.selectAll(".executed-body")
    .transition("rewindStage3")
      .attr('y2', 0);

  svg.selectAll(".body")
    .transition("rewindStage3")
      .attr('y1', 0);

  svg.selectAll(".start-time")
    .transition("rewindStage3")
      .attr('stroke-opacity', 0);

  svg.selectAll(".end-time")
    .transition("rewindStage3")
      .attr('stroke-opacity', 0);
}

function _goToStage(n) {
  switch (parseInt(n)) {
  case 0:
    _rewindStage3();
    _rewindStage2();
    _rewindStage1();
    _playStage0();
    break;
  case 1:
    _rewindStage3();
    _rewindStage2();
    _playStage0();
    _playStage1();
    break;
  case 2:
    _rewindStage3();
    _playStage0();
    _playStage1();
    _playStage2();
    break;
  case 3:
    _playStage0();
    _playStage1();
    _playStage2();
    _playStage3();
    break;
  }
  _updateExplanations(n);
}

function _makeExplanations() {
  return [
    {
      stageIndex: 0,
      explanation: "<== Gráfica que representa el retraso temporal que existe en  medición a las poblaciones mundiales por región."
    },
    {
      stageIndex: 1,
      explanation: "<em>Como parte de la función</em> Serán seleccionado para la representación dichos " + circleCount + " circulos como se puede observar."
    },
    {
      stageIndex: 2,
      explanation: "<b>Representación directa<sup>*</sup> de los esquemas de transición en cada circulo</b><br> Parte de ello fue consultado en el siguiente link <a href='http://bost.ocks.org/mike/transition/#per-element' target='_blank'> Ejemplo de Transición </a>, <em> La representación</em> de cada transición tiene su propio retardo, duración y valor final del atributo cy para los " + circleCount + " circulos; y es por ello que se visualiza como desciende cada unos de dichos circulos con su respectivo <em>retraso y</em>, <em>duración</em>, del cual, <em>cada una de las flechas</em> nos guían en el sentido que baja cada uno de los <em>circulos</em> así como el <em>tiempo</em> definido para observar el descenso asociado al segundo de inicio y el segundo de finalización de la gráfica por medio de una transición.<br><br><sup>*</sup>A continuación la siguiente opción muestra y finaliza dicha transición."
    },
    {
      stageIndex: 3,
      explanation: "Como se ha explicado con anterioridad haciendo uso de la función de transición, cuando se completa la programación de las transiciones, cada transición espera hasta que pueda comenzar, luego se ejecuta y luego se detiene<br><b>Cada avance ponderado por región se ejecuta de manera independiente</b><br>Cuando una transición se detiene o se interrumpe, esto no tiene ningún efecto secundario en otras transiciones<br> la sincronización gráfica de este tipo viene con retrasos y/o duraciones idénticas que se mueven en su debido tiempo por segundo según se representa en dicha gráfica."
    }
  ]
}

function _updateExplanations (index) {
  var explanation = explanations[index].explanation;

  explanationArea.transition()
    .style("opacity", 0)
    .each('end', function() {
      explanationArea.html(explanation);
    })
  .transition()
      .style("opacity", 1);
}