$(function () {
	var model = {
		days: 12,
		init: function () {
			if (!localStorage.attendance) {
				this.students = {
					"Han": [],
					"Leia": [],
					"Luke": [],
					"Greedo": [],
					"Snoke": []
				};

				//Create true/false array for each student
				for (var name in this.students) {
					for (i = 1; i <= this.days; i++) {
						this.students[name].push(octopus.getRandom());
					}
				}

				octopus.updateLocalStorage();

			} else {
				this.students = JSON.parse(localStorage.attendance);
			}
		},
	};

	var octopus = {
		getRandom: function () {
            return (Math.random() >= 0.5);
        },
        updateStudents: function (students) {
        	model.students = students;
        },
        updateLocalStorage: function () {
        	localStorage.attendance = JSON.stringify(model.students);
        },
        getDays: function () {
        	return model.days;
        },
        getStudents: function () {
        	return model.students;
        },
        init: function () {
        	model.init();
        	view.init();
        }
	};

	var view = {
		init: function () {
			this.header = $('thead tr');
			this.studentBody = $('tbody');
			this.students = octopus.getStudents();

			view.render();

			//Handler for checkbox interaction
			$('input').click(function () {
				view.update();
			});
		},
		render: function () {
			var days = octopus.getDays();

			//Render the headers
			this.header.append('<th class="name-col">Student Name</th>');
			for (i = 1; i <= days; i++) {
				var column = document.createElement('th');

				column.innerHTML = i;

				this.header.append(column);
			}
			this.header.append('<th class="missed-col">Days Missed</th>');

			//Render the student rows with initial checks
			for (var name in this.students) {
				var missed = 0;

				var row = document.createElement('tr');
				$(row).addClass("student");

				var nameCol = document.createElement('td');
				$(nameCol).addClass("name-col");
				nameCol.innerHTML = name;

				row.appendChild(nameCol);

				//Create a checkbox column for each day in this row
				for (i = 0; i < days; i++) {
					var dayCol = document.createElement('td');
					$(dayCol).addClass("attend-col");

					var check = document.createElement('input');
					check.type = "checkbox";
					if (this.students[name][i]) {
						check.checked = true;
						
					} else {
						missed++;
					}

					dayCol.appendChild(check);
					row.appendChild(dayCol);
				}

				var missCol = document.createElement('td');
				$(missCol).addClass("missed-col");
				missCol.innerHTML = missed;

				row.appendChild(missCol);

				this.studentBody.append(row);
			}

		},
		update: function () {
			var rows = $('.student');
			var newStudents = {};

			rows.each(function () {
				var name = $(this).children('.name-col').text();
				newStudents[name] = [];
				var daysMissed = 0;

				var checkboxes = $(this).children('td').children('input');

				checkboxes.each(function () {
					if (!$(this).prop('checked')) {
                    	daysMissed++;
                	}
					newStudents[name].push($(this).prop('checked'));
				});

				$(this).children('.missed-col').text(daysMissed);
				octopus.updateStudents(newStudents);
				octopus.updateLocalStorage();
			});
		}
	};

	octopus.init();

});