Cryptris  
========

### A game about asymetric cryptography

Cryptris is a game designed to help people in getting a grasp about how cryptography works, by playing an arguably tetris-like game.

The game was developped by [Digital Cuisine](http://www.digitalcuisine.fr) for [Inria](http://www.inria.fr) with the support of [Cap'maths](http://www.capmaths.fr/) and is based on a concept created by Léo Ducas.


### Technology

This game uses html, css and javascript. No server were harmed during the development process.


### Installation

The whole application is designed to be a serverless application, hence the installation is pretty straightforward: simply clone this repository or download it as an archive.


### Launching the game

To launch the game, simply open the `index.html` file in a compatible web browser.

### Building & running the game

Note: Changing the app's url for your custom domain is just a matter of changing the url in `languages/custom.txt`.

**Before publishing the game,** make sure that you proceed to the following:

* run `javascript_replace.sh`
* run `translate.sh`
* upload to your new url and carefully test that every sharing function still works as expected.

### Hosting the game on github

To publish on github the only thing you need to do is to make sure that your `gh-pages` branch is up-to-date and push it to your github account. You should be able to access it via http://[username].github.io/cryptris where [username] should be replaced by your actual github username.

### Credits

Based on an original idea by Léo Ducas

#### Scénario
Mathieu Jouhet & Nicolas Pelletier

#### Inria
* **Coordination :** Service communication du centre de recherche Inria Paris - Rocquencourt
* **Référents médiation :** Thierry Vieville and Laurent Viennot
* **Référent scientifique :** Léo Ducas

#### Digital Cuisine
* **Directeur Artistique :** Mathieu Jouhet ([@daformat](https://twitter.com/daformat))
* **Graphiste :** Nicolas Pelletier
* **Game engine :** Vincent Mézino
* **Intégration html, développement javascript:** Mathieu Jouhet
* **Test :** Olivier Lance, Pierre-Jean Quilleré

#### Translation
* Translation system: Marc Stevens
* English: Leo Ducas and Marc Stevens 

___
### Links & references
[Digital Cuisine](http://www.digitalcuisine.fr)  
[Inria](http://www.inria.fr)
[Cap'maths](http://www.capmaths.fr/) 
