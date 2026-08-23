# Suivi des conversions — la convention, et pourquoi il n'y a aucun script

**Décidé le 23/08/2026**, sur validation du Président.

---

## ⛔ Ce qu'on ne fait PAS, et ce n'est pas une négligence

**Ni Google Analytics, ni le pixel Meta, ni aucun traceur.** Trois raisons, dans l'ordre où elles pèsent :

1. **Ils déposent des cookies.** Cela impose un bandeau de consentement, sur un site qui n'en a aucun, et oblige à réécrire la politique de confidentialité — qui affirme aujourd'hui, et à juste titre, que le site ne dépose aucun cookie de mesure d'audience ni de publicité.
2. **Ce sont des scripts tiers.** Nous vendons l'Audit Performance à 250 €, dont le cœur est le nettoyage des scripts inutiles. Un traceur sur notre propre site serait la première chose qu'un prospect un peu technique relèverait — et il aurait raison.
3. **Ils ne répondent pas à la question posée.** Ce qu'on veut savoir n'est pas « combien de visiteurs », c'est **quelle page a produit une vente**. Stripe le sait déjà.

⚠️ **Un bandeau de cookies fait mécaniquement chuter les conversions** : c'est le premier écran que voit un visiteur, et il demande un « non » avant d'avoir donné quoi que ce soit. En poser un pour mesurer les conversions revient à dégrader ce qu'on prétend mesurer.

---

## Ce qu'on fait à la place : le paramètre de provenance

**Chaque lien de paiement Stripe porte, dans son URL, l'endroit exact d'où le visiteur a cliqué.** Stripe conserve ce paramètre et l'attache au paiement. Zéro cookie, zéro script, zéro consentement à demander — et la réponse est exacte, pas statistique.

### La convention de nommage

```
?src=<page>-<emplacement>
```

| Page | Emplacement | Paramètre |
|---|---|---|
| Offres | carte Pack Conformité | `?src=offres-conformite` |
| Offres | carte Audit 360° | `?src=offres-audit360` |
| Offres | carte Kit Visuel | `?src=offres-kitvisuel` |
| Offres | carte Migration | `?src=offres-migration` |
| Offres | carte Performance | `?src=offres-performance` |
| Offres | carte SEO | `?src=offres-seo` |
| Offres | carte Pack Reboot | `?src=offres-reboot` |
| Offres | carte Suivi Mensuel | `?src=offres-suivi` |
| Rapport d'audit | bouton de commande | `?src=rapport-<identifiant du rapport>` |
| Accueil | bouton principal | `?src=accueil-haut` |
| Mail de prospection | bouton du message | `?src=mail-<date d'envoi>` |

**La ligne qui compte le plus est celle du rapport d'audit.** Chaque rapport porte un identifiant unique : on saura donc **quel prospect précis** a payé après avoir lu son audit, et lesquels ont lu sans acheter. C'est la mesure qui vaut, sur un modèle où le rapport remplace le rendez-vous.

### Ce que ça donne, concrètement

Au bout de quelques ventes, la question « d'où viennent mes clients » se répond en lisant les paiements Stripe — sans outil, sans abonnement, sans traceur. Et la question « quelle offre part le plus » aussi.

---

## Ce que ça NE donne pas, et il faut le savoir

**Le dénominateur.** On aura le nombre de ventes par page, pas le nombre de visiteurs. Donc pas de taux de conversion.

**Et c'est acceptable aujourd'hui, pour une raison arithmétique** : un taux calculé sur trois visiteurs ne veut rien dire. La mesure d'audience devient utile quand il y a du volume — pas avant.

**Quand elle le deviendra**, la bonne réponse sera un outil **sans cookie** (Plausible, Fathom, Simple Analytics — de l'ordre de 9 $/mois), pas Google Analytics : ils mesurent l'audience sans identifier personne, donc **sans bandeau de consentement**. À rouvrir le jour où le site reçoit assez de visiteurs pour qu'un pourcentage ait un sens.

---

## ⛔ La règle qui ne se négocie pas

**Aucun euro de publicité ne se dépense avant que ce suivi soit en place et qu'une page ait converti au moins une fois sans publicité.**

La publicité amplifie ce qui fonctionne ; elle ne répare rien. Payer pour envoyer des visiteurs sur une page dont on ignore si elle convertit, c'est acheter la découverte d'un problème qu'on peut trouver gratuitement. C'est l'erreur la plus commune et la plus chère du métier — et c'est précisément ce que le futur **Diagnostic Publicité** ira constater chez les autres.
