# Zoezi

![Logo](/images/logo.png)

Zoezi is a fitness app that allows users to create highly customizable workout routines, play them and share them with friends. It also displays fun gifs of your exercises. The app is focused on avoiding bloated interfaces and providing a simple and straightforward user experience. It's built to be used both on mobile and desktop, for people who like working out at home without depending completely on their smartphone for routine management.


## Architecture

Zoezi is a serverless Javascript app that uses Firebase to handle user creation/authentication and storing routine data. Its real time database allows changes by the user to reflect on the interface immediately. The app also sends AJAX requests to the Giphy API to load gifs of exercises.


## Built with

* Bootstrap (Grid and spacing, card and button styling)
* jQuery (For DOM manipulation and AJAX calls)
* Firebase (User creation/authentication, real-time database)
* Giphy API (To make routines more fun)
* Owl Carousel (To add some nice touchscreen capabilities to the routine list)


## Usage

Using Zoezi is simple. Sign up with an email and password of your choice.

![Homepage](/images/Screenshots/welcome.png)

Creating your profile will take you to the main user page, where your routines are displayed.

![User page](/images/Screenshots/userpage.png)

If you don't have any routines, you can click on "Create routine" to open the routine editor.

![Create a new routine](/images/Screenshots/create-routine.png)

Once your routine has been created, you can go back to the user page and click "Go" to launch it. Enjoy your workout (and the gifs)!

![Routine player](/images/Screenshots/player.png)

Each routine has a menu that allows you to delete, edit or share your routine. Very simple!


## Demo

Click [here](https://edgar821.github.io/zoezi/) to launch a deployed version of the app.


## Authors

* **[Edgar Chávez](https://github.com/edgar821)** - Routine player and editor functionality using JS and jQuery. Firebase real-time database.
* **[Fran Cuesta](https://github.com/IscoCuesta)** - Firebase authentication, Giphy API, routine player.
* **[Isabela Rabasa](https://github.com/isarabasa)** - User experience, homepage and UI design, routine editor.