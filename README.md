### ip-label

## Outil de recherche de film.

# Utilisation :

- Rendez-vous sur http://djulianouatla.com (le nom de domaine est récent, il se peut qu'il ne soit pas dans le cache de votre navigateur favori).
- Rentrez le titre dans un film (minimum 3 caractères).
- Naviguez à travers tous les résultats.

## API

# Utilisation :

Les requêtes doivent être adressées a l'adresse http://api.djulianouatla.com
Si vous n'avez pas de session active, elle sera générée automatiquement lors de votre premier appel api.

> /
> <br>
> /print

- Renvoie la liste des nombres.

> /addValue?value={insérer la valeur ici}

- Ajoute une valeur a la liste.

> /removeOne?value={insérer la valeur ici}

- Supprime la valeur de la liste. Si on retrouve plus d'une fois la valeur dans la liste, la première occurrence sera supprimée.

> /removeAll

- Supprime toutes les valeurs de la liste.

> /mean

- Calcul la moyenne de la liste.

> /medianMean

- Retourne la médiane de la liste.

> /operation/{insérer l'opération ici(substraction, addition, multiplication, division)}?value={insérer la valeur ici}

- Effectue l'opération sur tous les éléments de la liste.

> /recover?session_id={insérer l'id de votre session ici}

- Remplace votre session actuelle par la session mentionnée.
