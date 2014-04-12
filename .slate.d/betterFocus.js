/*
 * Todo:
 *
 * Il faut pouvoir changer le focus dans n'importe qu'elle direction
 * vers une fenêtre entirèrement au premier plan dans la partie
 * recherchée.
 *
 * La partie recherchée est toute la partie de l'écran (éventuellement
 * avec plusieurs moniteurs) située dans la direction choisie.
 *
 * Il faut une fonction qui détermine la zone de recherche, à savoir
 * toute la partie de l'écran située au moins un pixel après le bord
 * dans la direction sélectionnée de la fenêtre courante.
 *
 * Une fonction qui trouve les fenêtres visibles dans cette zone et de
 * taille raisonnable, les deux dimension supérieures à 100 px
 *
 * Une fonction (probablement récursive) qui à partir d'une fenêtre
 * trouve la fenêtre la plus au premier plan
 *
 * On peut alors stocker l'ensemble des fenêtres au premier plan dans
 * la zone et choisir parmis celles-ci sur des critères tels que la
 * proximité au bord de la fenêtre courante et la taille de bord en
 * commun avec la fenêtre courante (alignement des deux fenêtres). On
 * sélectionne les fenêtres qui ont un alignement non nul (ou toutes
 * s'il n'y en a pas), puis celles qui sont les plus proches parmis
 * celles-ci et enfin celle qui a le meilleur alignement (avec
 * priorité arbitraire) parmis celles-ci
 */
