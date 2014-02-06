pirateplotr
===========

Ushahidi viz for pirates to plot projects.  

Check out the [example here](http://ushahidi-auremoser.dotcloud.com/#).

### about
This is a simple sortable chart for viewing projects and tracking them on a timeline. Future use cases might be adding resources to projects and plotting for planning. 

This is mostly for pirates but also for everyone to have a global view of what's going on when and how the milestones/expectations/resourcing needs shake out.

### how to
1. Edit the csv in the /data folder to your desired plotting verbage. 
2. Save/Commit to update the chart.
3. View and Sort! 

### data
Data csv looks like this:

name	| amount	| start_date	| end_date 	| team
:---:	| :----: 	| :--------: 	| :------: 	| :----:
project1 | value1 	| date1 		| date2 	| external
project2 | value2 	| date1 		| date2 	| core

#### key
* **name** is project name
* **amount** is an arbitrary weight (price point? resources?)
* **dates** are the start and end date of a project
* **team** is a an arbitrary tag assigned to projects for sorting purposes  

It's a spreadsheet because that's a maintainable format for all contributors; easily editable/updatable.

Eventually maybe we'll update it as a github page linked to this repo.

Yays thanks for reading!








