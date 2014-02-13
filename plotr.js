// (function() {
	// Function global to uncomment when push into someone else code, keep my vars mine
	'use strict';

	var canvas_left_edge = $('#chart-canvas').offset().left;
	var canvas_width = $('#chart-canvas').width();

	var teamColorScale = d3.scale.ordinal()
		.domain(['BRCK', 'CrisisNet', 'Crowdmap', 'External Projects', 'MAVC', 'Operations', 'RRI', 'V3'])
		.range(['#d53e4f', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#abdda4', '#66c2a5', '#3288bd']);

	var priorityScale = d3.scale.linear()
		// .domain([-1, 0, 1])
		.range(['#ffffb2', '#fed976', '#feb24c', '#fd8d3c', '#f03b20', '#bd0026']);

	var xScale = d3.time.scale()
		.rangeRound([125, canvas_width]);


	var data, bars;

	/*
	 * Load in data
	 */
	 // Data comes in as a simple updateable csv, so names entities, values can update
	 // Totes arbitrary values at this point for "priority", fix that
	 // Priority is a column field because there's probably some # value we'll want to sort deliverables by

	 var dateFormat = d3.time.format('%m/%d/%y');

	 d3.csv('data/sample_data.csv', function(csv) {
		// console.log(data)
		data = csv
		console.log("Handle data");
		// Tidy all the data in to the correct types as CSV gives everything as a string
		data.forEach(function(d) {
			d.start_date = dateFormat.parse(d.start_date);
			d.end_date = dateFormat.parse(d.end_date);
			d.priority = parseInt(d.priority);
		});
		// Set priority extent and scaling for whatever amount you want to prioritize (resources, counts, downloads, anything numeric)
		var priority_extent = d3.extent(data, function(d) {return d.priority});
		console.log(priority_extent)
		priorityScale.domain([-50,50]);

		// Find min/max of our dates
		var min = d3.min(data, function(d) { return d.start_date });
		var max = d3.max(data, function(d) { return d.end_date });

		xScale.domain([min, max]);

		console.log(data);
		render();
	})


	function render() {

		// Compute the height our canvas needs to be once we get the data
		var number_of_bars = data.length;
		var bar_height = 20;
		var bar_margin_bottom = 10;
		var container_top_padding = 30;
		var container_bottom_padding = 40;
		var canvas_height = number_of_bars * (bar_height + bar_margin_bottom) + container_top_padding + container_bottom_padding;

		$('#chart-canvas').css('height', canvas_height);

		// TODO move in to initial draw function

		// Create base axis; assign scale made up above
		var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient('bottom');

		// Create svg container
		var svg = d3.select('#svg-canvas')
		.append('svg')
		.attr('width', canvas_width)
		.attr('height', canvas_height);

		// Bottom Axis
		var btmAxis = svg.append('g')
		.attr('transform', 'translate(0,'+ (canvas_height - 30) + ')')
		.attr('class', 'axis')
		.call(xAxis);

		// Top Axis
		var topAxis = svg.append('g')
		.attr('transform', 'translate(0,0)')
		.attr('class', 'axis')
		.call(xAxis);

		// Lines
		var line = svg.append('g')
		.selectAll('line')
		.data(xScale.ticks(10))
		.enter().append('line')
		.attr('x1', xScale)
		.attr('x2', xScale)
		.attr('y1', 30)
		.attr('y2', canvas_height - 25)
		.style('stroke', '#ccc');

		// Rewrote bar_wrapper and new bar draw + value['somedate header type'] because it was long and confusing

		var ganttBarContainer = d3.select('#gantt-bar-container')
		var barWrappers = ganttBarContainer.selectAll('.bar-wrapper')
			.data(data)

		var tooltip = d3.select("#tooltip")

		barWrappers
			.enter()
			.append('div')
			.attr('class', function(d) { return 'bar-wrapper ' + d.type })
			// begin vicious hacks
			.attr('data-name', function(d) { return d.deliverable  })
			.attr('data-start_date', function(d) { return d.start_date.getTime() })
			.attr('data-end_date', function(d) { return d.end_date.getTime() })
			.attr('data-priority', function(d) { return d.priority })
			.attr('data-team', function(d) { return d.team })
			.on("mouseover", function (d, i) {
			    tooltip
			        .select("#cpcVal")
			        .text(d.cpc);

			    tooltip
			        .select("#volVal")
			        .text(d.deliverable);

			    tooltip
			        .select("#keyword")
			        .style("color", d3.select(this).style("fill"))
			        .text(d.team);
			    
			    tooltip.style("display", 'block');
			})
			.on("mouseout", function (d, i) {
			    tooltip.style("display", 'none');
			})
			.on("mousemove", function (d, i) {
		        console.log('mousemove');
		        // console.log(d3.mouse(this));
		        var xy = d3.mouse(this)

			    //Get this bar's x/y values, then augment for the tooltip
			    // var p = transformEventCoordsToNodeCoords(window.event, this);
			   var xPosition = d3.event.x;
			    var yPosition = d3.event.y;
			    console.log($(this))
			    //Update Tooltip Position & value
			    tooltip
			        .style("left", xy[0] + "px")
			        .style("top", xy[1] + "px")
			})
			// end vicious hacks :'(

		// TODO set the top offset to replace isotope
		// barWrappers
		// 	.style('top', function(d) { 
		// 		// return sometihng based on filter 
		// 	})
		function transformEventCoordsToNodeCoords(evt,node)
		{
		  var point = document.documentElement.createSVGPoint();
		  point.x = evt.clientX;
		  point.y = evt.clientY;

		  var ctm = node.getScreenCTM();
		  return point.matrixTransform(ctm.inverse());
		}

		bars = barWrappers
			.append('div')
				.attr('class', 'bar')
				.style('margin-left', function(d,i) { return xScale(d.start_date) + 'px' })
				.style('width', function(d,i) { return xScale(d.end_date) - xScale(d.start_date) + 'px' })


		bars	
			.append('div')
				.attr('class', 'bar-name')
				.text(function(d) { return /*d.priority + ' ' +*/ d.deliverable })

		var $container = $('#gantt-bar-container');

		$container.isotope({
			itemSelector: '.bar-wrapper',
			getSortData: {
				deliverable: function($elem ) {
					return $elem.attr('data-name').toLowerCase();
				},
				start_date: function($elem ) {
					return parseInt($elem.attr('data-start_date'));
				},
				end_date: function($elem ) {
					return parseInt($elem.attr('data-end_date'));
				},
				priority: function($elem ) {
					return parseInt($elem.attr('data-priority'));
				}
			}
		});

	}

	// Sorting buttons
	// So let's make a simple sort_ascending boolean variable and set it to true
	var sort_ascending = true;

	// Use d3 for events
	$('#sorter li a').click(function() {
		// Set it to what it isn't, if it was true, make it false and vice versa
		// So, when you click a button twice, it will flop its sort order; a simple toggle
		sort_ascending = !sort_ascending;
		var sorter_selector = $(this).attr('data-sorter');
		console.log("SORT:", sorter_selector);
		// When we update the isotope layout, it has a property called sortAscending that will then get our value
		$('#gantt-bar-container').isotope({ sortBy: sorter_selector, sortAscending: sort_ascending });
		
		// TODO hovers/tooltips on each bar, to show what team, start/end dates, filter type, priority value, for clarity
		// It could also use hover boxes, but i've done that, simple matter of adding other jquery things. What we'll want to do is create a .mouseover() jquery listener on the chart canvas that will update the x and y position of a hover window that we create (and that will be set default to display:none). On mouseover of our .bar-wrapper should show our hover window and it should eyedrop the data attributes that assigned to that element, on mouseout it should hide the box.
	});

	// TODO use d3 for events
	// Filter buttons
	$('#filter li a').click(function() {
		var filter_selector = $(this).attr('data-filter');
		console.log(filter_selector)
		$('#gantt-bar-container').isotope({ filter: filter_selector });
		return false;
	});

	// Color buttons
	$('#color li a').click(function() {
		var color_selector = $(this).attr('data-color');
		// Get all the bars
		var $bar_wrappers = $('.bar-wrapper');

		// TODO use switch statment instead of if elses
		// Replaced jquery bar_wrapper stuff with D3 from previous version, for those keeping track
		// Shorter code block, whoot
		if (color_selector == 'priority') {
		 	bars.style('background-color', function(d) { return priorityScale(d.priority); })
		}else if (color_selector == 'team') {
		 	bars.style('background-color', function(d) { return teamColorScale(d.team);})
		}else {
		 	bars.style('background-color', '')

		}

	});

// })();
