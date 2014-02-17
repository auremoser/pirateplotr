pirateplotr
===========

Ushahidi viz for pirates to plot projects and milestones.  

Check out the [example here](http://auremoser.github.io/pirateplotr/).

### about
This is a simple sortable chart for viewing projects and tracking them on a timeline. 

This is mostly for pirates but also for everyone to have a global view of what's going on when and how the milestones/expectations/resourcing needs shake out.

### how to
1. Edit the csv in the /data folder to your desired plotting verbage. 
2. Save/Commit to update the chart.
3. View and Sort!

![Chart](https://raw2.github.com/auremoser/images/master/plotr.png) 

### data
Data csv looks like this:

![data.csv](https://raw2.github.com/auremoser/images/master/plotr-sheet.png)

Headers are static, but all values are editable in the data.csv file.

deliverable	| priority	| start_date	| end_date 	| team | type
:---:	| :----: 	| :--------: 	| :------: 	| :----: | :----:
project1 | value1 	| date1 		| date2 	| [V3/CrisisNet/...] | external
project2 | value2 	| date1 		| date2 	| [V3/CrisisNet/...] | core

#### key
* **deliverable** is project name
* **priority** is an arbitrary weight (price point? resources?)[^1]
* **dates** are the start and end date of a project
* **team** is the name of the team responsible for the deliverable
* **type** is one of 4 categories for filtering purposes (core, external, ops, milestone[^2])


It's a spreadsheet because that's a maintainable format for all contributors; easily editable/updatable.

Eventually maybe we'll update it as a github page linked to this repo.

Yays thanks for reading!

[^1]: We can decide what numerical value to prioritize by, I just wanted to log this as a sortable placeholder for future values we might want to track.
[^2]: Milestones are vertical plum lines on the chart. You can draw a plum line, as opposed to a bar, by entering a deliverable name, start_date and type of project as "milestone"). Check the csv for examples of this.








