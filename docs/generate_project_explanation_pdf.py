from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import (
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "docs" / "explication-complete-projet-pbxcom.pdf"


def p(text: str, style: str = "Body"):
    return Paragraph(text, STYLES[style])


def section(title: str):
    return [Spacer(1, 0.25 * cm), p(title, "Heading1"), Spacer(1, 0.12 * cm)]


def subsection(title: str):
    return [Spacer(1, 0.18 * cm), p(title, "Heading2"), Spacer(1, 0.08 * cm)]


def bullets(items):
    flow = []
    for item in items:
        flow.append(p(f"• {item}", "Bullet"))
    return flow


def file_block(path: str, role: str, work: str, defense: str):
    return [
        p(path, "FileTitle"),
        p(f"<b>Rôle :</b> {role}", "Body"),
        p(f"<b>Ce qu'on a fait :</b> {work}", "Body"),
        p(f"<b>À dire à l'encadrant :</b> {defense}", "Body"),
        Spacer(1, 0.12 * cm),
    ]


styles = getSampleStyleSheet()
STYLES = {
    "Title": ParagraphStyle(
        "Title",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=22,
        leading=28,
        alignment=TA_CENTER,
        textColor=colors.HexColor("#172033"),
        spaceAfter=14,
    ),
    "Subtitle": ParagraphStyle(
        "Subtitle",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=11,
        leading=16,
        alignment=TA_CENTER,
        textColor=colors.HexColor("#475569"),
        spaceAfter=18,
    ),
    "Heading1": ParagraphStyle(
        "Heading1",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=16,
        leading=20,
        textColor=colors.HexColor("#111827"),
        spaceBefore=8,
        spaceAfter=5,
    ),
    "Heading2": ParagraphStyle(
        "Heading2",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=12.5,
        leading=16,
        textColor=colors.HexColor("#1f2937"),
        spaceBefore=5,
        spaceAfter=4,
    ),
    "Body": ParagraphStyle(
        "Body",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=9.4,
        leading=13.2,
        alignment=TA_LEFT,
        textColor=colors.HexColor("#1f2937"),
        spaceAfter=4,
    ),
    "Bullet": ParagraphStyle(
        "Bullet",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=9.4,
        leading=13.2,
        leftIndent=12,
        firstLineIndent=-8,
        textColor=colors.HexColor("#1f2937"),
        spaceAfter=3,
    ),
    "FileTitle": ParagraphStyle(
        "FileTitle",
        parent=styles["BodyText"],
        fontName="Helvetica-Bold",
        fontSize=10.2,
        leading=13.5,
        textColor=colors.HexColor("#2563eb"),
        spaceBefore=5,
        spaceAfter=3,
    ),
    "Small": ParagraphStyle(
        "Small",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=8.5,
        leading=11.5,
        textColor=colors.HexColor("#475569"),
        spaceAfter=3,
    ),
}


def add_page_number(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(colors.HexColor("#64748b"))
    canvas.drawString(1.6 * cm, 1.1 * cm, "Explication complète du projet PBxcom")
    canvas.drawRightString(A4[0] - 1.6 * cm, 1.1 * cm, f"Page {doc.page}")
    canvas.restoreState()


def build_story():
    story = []

    story.append(p("Explication complète du projet PBxcom", "Title"))
    story.append(
        p(
            "Guide de compréhension de A à Z : architecture, parcours utilisateur, fichiers frontend, fichiers backend, "
            "et réponses prêtes pour l'encadrant.",
            "Subtitle",
        )
    )

    story += section("1. Résumé du projet")
    story += bullets(
        [
            "<b>Nom du projet :</b> PBxcom support platform.",
            "<b>Objectif :</b> permettre aux clients de créer des tickets de support, et aux administrateurs/employés PBxcom de les consulter, les traiter, les commenter, les imprimer et suivre leur état.",
            "<b>Frontend :</b> React avec Vite, Tailwind CSS, Zustand, React Router, Axios, Framer Motion et Lucide Icons.",
            "<b>Backend :</b> Node.js avec Express, MongoDB/Mongoose, JWT, bcrypt, Nodemailer et middleware de sécurité.",
            "<b>État actuel :</b> le frontend est utilisable même sans serveur grâce à un stockage local dans le navigateur. Le backend est prêt pour une vraie base MongoDB et de vrais emails.",
        ]
    )

    story += section("2. Architecture générale")
    data = [
        ["Couche", "Rôle simple", "Exemples de fichiers"],
        ["Interface", "Pages, formulaires, tableaux, boutons et navigation.", "src/pages, src/components"],
        ["État local", "Stocke utilisateur, tickets, thème, langue et notifications.", "src/store"],
        ["Services", "Appels API, lecture des fichiers joints, villes marocaines.", "src/services"],
        ["API backend", "Routes Express, sécurité, MongoDB, emails.", "backend/src"],
        ["Configuration", "Vite, ESLint, Vercel, variables d'environnement.", "package.json, vite.config.js, vercel.json"],
    ]
    table = Table(data, colWidths=[3.2 * cm, 7.4 * cm, 5.6 * cm])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#e2f7d3")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.HexColor("#111827")),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
                ("FONTSIZE", (0, 0), (-1, -1), 8.4),
                ("LEADING", (0, 0), (-1, -1), 10.5),
                ("GRID", (0, 0), (-1, -1), 0.3, colors.HexColor("#cbd5e1")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f8fafc")]),
            ]
        )
    )
    story.append(table)

    story += subsection("Flux principal")
    story += bullets(
        [
            "Un client crée un compte ou se connecte.",
            "Il remplit un formulaire de ticket avec ses informations, la ville, la description du problème et éventuellement des pièces jointes.",
            "Le ticket est enregistré localement si l'API n'est pas disponible, ou envoyé au backend si l'API répond.",
            "Un admin ou employé voit le ticket dans son tableau de bord, le marque comme vu, change le statut, ajoute une note interne ou répond au client.",
            "Les notifications sont simulées dans le frontend, et le backend contient aussi l'envoi réel par email via SMTP.",
        ]
    )

    story += section("3. Technologies utilisées")
    story += bullets(
        [
            "<b>React :</b> construit l'interface sous forme de composants réutilisables.",
            "<b>Vite :</b> lance le projet rapidement en développement et construit le dossier final <b>dist</b>.",
            "<b>Tailwind CSS :</b> gère le design directement avec des classes utilitaires.",
            "<b>Zustand :</b> sert de magasin global pour partager les données entre pages.",
            "<b>React Router :</b> gère les URLs comme /login, /client, /admin/tickets.",
            "<b>Axios :</b> prépare les appels HTTP vers le backend.",
            "<b>Express :</b> expose les endpoints API côté serveur.",
            "<b>MongoDB/Mongoose :</b> structure les données utilisateurs et tickets.",
            "<b>JWT + bcrypt :</b> sécurisent la connexion : token d'accès et mot de passe hashé.",
            "<b>Nodemailer :</b> permet d'envoyer des emails de notification ou de réinitialisation.",
        ]
    )

    story.append(PageBreak())
    story += section("4. Explication fichier par fichier : racine du projet")
    root_files = [
        ("README.md", "Fichier d'information initial de Vite.", "Il explique le template React/Vite de base. Il n'a pas encore été personnalisé pour PBxcom.", "Dire que c'est le README généré au départ, mais que l'application réelle se trouve dans src et backend."),
        ("package.json", "Déclare le projet frontend et ses dépendances.", "On y a les scripts dev, build, lint et preview, plus React, Vite, Tailwind, Zustand, Axios, etc.", "Dire que c'est la carte d'identité du frontend."),
        ("package-lock.json", "Verrouille les versions exactes installées.", "Il est généré automatiquement par npm pour garantir les mêmes versions sur une autre machine.", "Dire qu'on ne le modifie pas manuellement."),
        ("index.html", "Point d'entrée HTML.", "Il contient la div root et charge src/main.jsx.", "Dire que React injecte toute l'application dans #root."),
        ("vite.config.js", "Configuration de Vite.", "Active le plugin React et le plugin Tailwind.", "Dire que Vite sait ainsi compiler JSX et CSS Tailwind."),
        ("eslint.config.js", "Configuration de contrôle qualité du code.", "Définit les règles pour les fichiers React et Node backend.", "Dire qu'ESLint aide à détecter les erreurs avant l'exécution."),
        ("vercel.json", "Configuration de déploiement Vercel.", "Indique comment construire l'application et redirige les routes vers l'application React.", "Dire que c'est utile pour que /client ou /admin marche même après rafraîchissement."),
        (".env", "Variables locales du frontend.", "Contient les valeurs privées locales. Le contenu ne doit pas être publié.", "Dire que les secrets restent dans .env, pas dans le code."),
        (".gitignore", "Liste les fichiers à ne pas versionner.", "Ignore normalement node_modules, dist, fichiers système, variables privées, etc.", "Dire qu'il protège le dépôt contre les fichiers inutiles ou sensibles."),
        ("dist/", "Version compilée du frontend.", "Dossier généré après npm run build.", "Dire que c'est ce qu'on peut déployer, mais qu'on ne travaille pas directement dedans."),
        ("node_modules/", "Bibliothèques installées.", "Dossier généré par npm install.", "Dire qu'il est lourd, généré automatiquement, et non écrit à la main."),
    ]
    for item in root_files:
        story += file_block(*item)

    story.append(PageBreak())
    story += section("5. Frontend : démarrage et structure globale")
    frontend_core = [
        ("src/main.jsx", "Démarre l'application React.", "Il importe le CSS global, importe App, puis rend App dans l'élément HTML #root avec StrictMode.", "Dire que c'est le premier fichier JavaScript exécuté côté frontend."),
        ("src/app/App.jsx", "Définit toutes les routes de l'application.", "Il branche les pages auth, client, admin, la protection par rôle, le layout et les toasts.", "Dire que c'est le plan de navigation du projet."),
        ("src/index.css", "Style global de l'application.", "Importe Tailwind, définit la variante dark, les couleurs PBxcom, l'arrière-plan animé et les règles d'impression.", "Dire que ce fichier donne l'identité visuelle et permet d'imprimer proprement les tickets."),
    ]
    for item in frontend_core:
        story += file_block(*item)

    story += section("6. Frontend : services et données")
    services = [
        ("src/services/api.js", "Centralise la connexion au backend.", "Crée une instance Axios, ajoute automatiquement le token JWT dans les headers, traduit les erreurs et convertit un fichier en pièce jointe base64.", "Dire que tout appel serveur passe par ce service pour éviter de répéter le code."),
        ("src/services/moroccanCities.js", "Liste les villes marocaines.", "Fournit un tableau de villes et une fonction getMoroccanCities utilisée dans le formulaire de ticket.", "Dire que cela évite la saisie libre de la ville et rend le formulaire plus propre."),
        ("src/data/seedData.js", "Données de départ.", "Déclare les statuts possibles, le compte admin par défaut et une liste de tickets vide.", "Dire que le compte admin local permet de tester sans backend."),
        ("src/utils/formatters.js", "Fonctions d'affichage.", "Formate les dates, calcule les initiales d'un nom et choisit la couleur d'un badge selon le statut.", "Dire que ces fonctions évitent de répéter la logique d'affichage partout."),
        ("src/utils/tickets.js", "Fonctions utilitaires des tickets.", "Formate les numéros de tickets, extrait leur valeur numérique, calcule le prochain numéro et trie les tickets.", "Dire que cela garantit des tickets ordonnés comme 00001, 00002, etc."),
    ]
    for item in services:
        story += file_block(*item)

    story.append(PageBreak())
    story += section("7. Frontend : stores Zustand")
    stores = [
        ("src/store/authStore.js", "Gère l'authentification côté frontend.", "Contient login, register, updateProfile, forgotPassword, resetDemoData et logout. Il tente d'abord l'API réelle, puis bascule sur le mode local si le serveur ne répond pas.", "Dire que le projet fonctionne en démonstration sans base de données grâce à ce fallback local."),
        ("src/store/ticketStore.js", "Gère les tickets.", "Charge, crée, modifie le statut, marque comme vu, ajoute notes, messages, pièces jointes et retrouve un ticket par ID. Comme authStore, il utilise l'API si possible puis le stockage local.", "Dire que c'est le coeur métier du frontend."),
        ("src/store/notificationStore.js", "Simule les notifications email dans l'interface.", "Crée des notifications avec destinataire, sujet, message, ticketId et état lu/non lu.", "Dire que c'est une simulation visible côté frontend, pendant que le backend contient l'email réel."),
        ("src/store/toastStore.js", "Gère les messages courts de succès ou erreur.", "Ajoute et retire les toasts affichés en bas de l'écran.", "Dire que cela améliore l'expérience utilisateur après une action."),
        ("src/store/themeStore.js", "Gère le thème clair, sombre ou système.", "Stocke le choix utilisateur et applique la classe dark sur la balise html.", "Dire que le thème reste mémorisé dans le navigateur."),
        ("src/store/languageStore.js", "Gère les langues.", "Contient les textes anglais, français et arabes, le choix de langue, et change aussi dir=rtl pour l'arabe.", "Dire que l'application est préparée pour une interface multilingue."),
    ]
    for item in stores:
        story += file_block(*item)

    story.append(PageBreak())
    story += section("8. Frontend : composants layout")
    layouts = [
        ("src/components/layout/AuthLayout.jsx", "Layout des pages de connexion.", "Affiche la partie visuelle PBxcom, le logo, le texte marketing, le switch thème et l'emplacement des formulaires auth via Outlet.", "Dire que ce composant évite de répéter la même structure sur login/register/forgot/reset."),
        ("src/components/layout/DashboardLayout.jsx", "Layout principal après connexion.", "Crée la sidebar, le header, la recherche admin, le centre de notifications, l'affichage utilisateur, logout, responsive mobile et l'Outlet des pages.", "Dire que c'est le cadre commun de toutes les pages client et admin."),
        ("src/components/layout/ProtectedRoute.jsx", "Protection des routes.", "Redirige vers /login si aucun utilisateur n'est connecté, et bloque l'accès si le rôle n'est pas autorisé.", "Dire que c'est la première sécurité côté interface, complétée par le backend."),
        ("src/components/layout/ThemeSwitcher.jsx", "Sélecteur de thème.", "Affiche trois boutons avec icônes : clair, sombre, système.", "Dire qu'il modifie le store de thème, pas seulement un style local."),
    ]
    for item in layouts:
        story += file_block(*item)

    story += section("9. Frontend : composants UI")
    ui_files = [
        ("src/components/ui/Button.jsx", "Bouton réutilisable.", "Propose des variantes primary, secondary, ghost et danger avec le même style de base.", "Dire qu'un seul composant garantit des boutons cohérents."),
        ("src/components/ui/Input.jsx", "Champs de formulaire.", "Contient Input, PasswordInput avec affichage/masquage, Textarea et gestion des erreurs.", "Dire que les formulaires deviennent plus simples et uniformes."),
        ("src/components/ui/Select.jsx", "Liste déroulante réutilisable.", "Gère label, required, erreur et style Tailwind.", "Dire qu'elle est utilisée pour statut, rôle, langue et ville."),
        ("src/components/ui/Card.jsx", "Bloc visuel réutilisable.", "Encadre les zones importantes avec bordure, fond, ombre et hover.", "Dire que c'est la base des panneaux de dashboard."),
        ("src/components/ui/Badge.jsx", "Petit indicateur coloré.", "Affiche un statut avec la couleur calculée par statusTone.", "Dire qu'il rend l'état d'un ticket lisible rapidement."),
        ("src/components/ui/PageHeader.jsx", "En-tête de page.", "Standardise eyebrow, titre, description et bouton d'action.", "Dire qu'il donne une cohérence aux pages."),
        ("src/components/ui/EmptyState.jsx", "État vide.", "Affiche une icône, un titre, une description et éventuellement une action.", "Dire qu'on évite les pages vides incompréhensibles."),
        ("src/components/ui/ToastHost.jsx", "Affichage des notifications courtes.", "Écoute le toastStore et affiche les messages animés avec succès ou erreur.", "Dire que l'utilisateur reçoit un retour immédiat."),
        ("src/components/ui/Skeleton.jsx", "Placeholder de chargement.", "Définit un bloc animé pour représenter un chargement.", "Dire qu'il est prêt si on ajoute des chargements visuels."),
        ("src/components/ui/BrandLogo.jsx", "Logo PBxcom.", "Affiche un logo différent selon le thème clair/sombre et supporte un mode compact.", "Dire que le branding reste lisible dans tous les thèmes."),
    ]
    for item in ui_files:
        story += file_block(*item)

    story.append(PageBreak())
    story += section("10. Frontend : composants tickets")
    ticket_components = [
        ("src/components/tickets/TicketTable.jsx", "Tableau de tickets.", "Trie les tickets, affiche ticket, client, problème, statut, priorité, date et lien d'ouverture.", "Dire que c'est la vue principale pour consulter une liste de tickets."),
        ("src/components/tickets/TicketCard.jsx", "Carte ticket.", "Affiche une version compacte d'un ticket avec badge, description, société et date.", "Dire qu'il peut servir pour une vue en cartes."),
        ("src/components/tickets/TicketTimeline.jsx", "Historique du ticket.", "Affiche les événements du ticket dans une timeline verticale.", "Dire qu'il permet de justifier la traçabilité des actions."),
        ("src/components/tickets/PrintableTicket.jsx", "Version imprimable.", "Présente le ticket avec informations client, statut, priorité, sujet et description dans une zone compatible impression.", "Dire que l'admin peut imprimer une fiche de service claire."),
    ]
    for item in ticket_components:
        story += file_block(*item)

    story += section("11. Frontend : pages d'authentification")
    auth_pages = [
        ("src/pages/auth/Login.jsx", "Page connexion.", "Formulaire email/mot de passe, appelle login, affiche toast et redirige client vers /client ou admin/employé vers /admin.", "Dire que la redirection dépend du rôle."),
        ("src/pages/auth/Register.jsx", "Page création compte client.", "Crée un compte client avec nom, société, email et mot de passe puis redirige vers l'espace client.", "Dire que seuls les clients s'inscrivent eux-mêmes."),
        ("src/pages/auth/ForgotPassword.jsx", "Page mot de passe oublié.", "Demande l'email et appelle forgotPassword pour envoyer les instructions si le compte existe.", "Dire que la réponse reste volontairement générique pour éviter de révéler les emails existants."),
        ("src/pages/auth/ResetPassword.jsx", "Page nouveau mot de passe.", "Lit le token dans l'URL et appelle l'API /auth/reset-password avec le nouveau mot de passe.", "Dire que cette page dépend du lien envoyé par email."),
        ("src/pages/NotFound.jsx", "Page 404.", "Affiche une page simple si l'URL n'existe pas ou si un ticket est inaccessible.", "Dire qu'elle protège aussi contre l'accès à un ticket non autorisé côté client."),
    ]
    for item in auth_pages:
        story += file_block(*item)

    story.append(PageBreak())
    story += section("12. Frontend : pages client")
    client_pages = [
        ("src/pages/client/ClientDashboard.jsx", "Dashboard client.", "Réutilise directement ClientTickets pour afficher l'historique comme page d'accueil client.", "Dire que l'espace client est centré sur l'historique des demandes."),
        ("src/pages/client/ClientTickets.jsx", "Historique client.", "Filtre les tickets de l'utilisateur connecté, permet recherche et filtre par statut, puis affiche TicketTable ou EmptyState.", "Dire qu'un client ne voit que ses propres tickets."),
        ("src/pages/client/CreateTicket.jsx", "Création de ticket.", "Formulaire complet : identité client, société, marché, facture, téléphone, email, ville, description, pièces jointes. Valide les champs, crée le ticket et notifie les admins.", "Dire que c'est le point principal d'entrée des demandes support."),
        ("src/pages/client/TicketDetail.jsx", "Détail ticket côté client.", "Affiche description, informations client, historique, conversation, réponse et pièces jointes. Refuse l'accès si le ticket n'appartient pas au client.", "Dire que le client peut suivre et enrichir sa demande."),
        ("src/pages/client/ClientSettings.jsx", "Paramètres client.", "Permet de modifier profil, email, mot de passe, langue, et de réinitialiser les données de démonstration locales.", "Dire que cette page montre la personnalisation du compte."),
    ]
    for item in client_pages:
        story += file_block(*item)

    story += section("13. Frontend : pages admin")
    admin_pages = [
        ("src/pages/admin/AdminDashboard.jsx", "Tableau de bord admin.", "Calcule les statistiques principales, affiche les activités récentes et les derniers tickets.", "Dire que l'admin a une vue globale de l'activité support."),
        ("src/pages/admin/AdminTickets.jsx", "Gestion des tickets.", "Liste tous les tickets, recherche par ticket/client/facture/description, filtre par statut et affiche une pagination visuelle.", "Dire que c'est la page de travail quotidienne de l'équipe support."),
        ("src/pages/admin/AdminTicketDetail.jsx", "Détail ticket admin.", "Marque le ticket comme lu, permet changement de statut, résolution, impression, note interne, réponse client, pièce jointe et historique.", "Dire que c'est la page la plus complète côté métier."),
        ("src/pages/admin/AdminAnalytics.jsx", "Analytique support.", "Calcule total, pending, seen, in progress, resolved, closed, activité et taux de résolution.", "Dire que cette page transforme les tickets en indicateurs de performance."),
        ("src/pages/admin/AdminEmployees.jsx", "Gestion employés.", "Appelle l'API réelle pour lister, créer et activer/désactiver les comptes employés/admin.", "Dire que cette partie dépend du backend car elle touche aux comptes internes."),
    ]
    for item in admin_pages:
        story += file_block(*item)

    story.append(PageBreak())
    story += section("14. Backend : configuration et serveur")
    backend_core = [
        ("backend/package.json", "Carte d'identité du backend.", "Déclare Express, Mongoose, JWT, bcrypt, Nodemailer, dotenv, helmet, cors, morgan et les scripts dev/start/admin:create.", "Dire que ce package est séparé du frontend pour gérer l'API."),
        ("backend/package-lock.json", "Versions exactes du backend.", "Généré automatiquement par npm.", "Dire qu'il garantit la reproductibilité des installations."),
        ("backend/README.md", "Documentation backend.", "Présente les endpoints principaux, la création d'un admin réel et l'intégration future avec le frontend.", "Dire qu'il explique comment passer du mode démo au mode API réelle."),
        ("backend/.env.example", "Exemple de variables d'environnement.", "Liste PORT, MONGO_URI, JWT_SECRET, CLIENT_URL, ADMIN_* et SMTP_*.", "Dire qu'il sert de modèle pour créer un .env sans exposer les secrets."),
        ("backend/src/server.js", "Point d'entrée de l'API.", "Configure Express, helmet, cors, JSON, morgan, route health, routes auth/employees/tickets, gestion d'erreur, connexion MongoDB et lancement du port.", "Dire que rien ne démarre sans connexion MongoDB valide."),
        ("backend/src/config/database.js", "Connexion MongoDB.", "Vérifie que MONGO_URI existe, active strictQuery et connecte Mongoose avec timeout.", "Dire que cette séparation rend la connexion réutilisable, notamment pour le script admin."),
    ]
    for item in backend_core:
        story += file_block(*item)

    story += section("15. Backend : modèles MongoDB")
    models = [
        ("backend/src/models/User.js", "Modèle utilisateur.", "Définit nom, email unique, passwordHash, société, rôle client/employee/admin, active, resetToken et dates automatiques.", "Dire que le mot de passe n'est jamais stocké en clair côté backend."),
        ("backend/src/models/Ticket.js", "Modèle ticket.", "Définit publicId, utilisateur, sujet, description, priorité, statut, infos client, historique, notes, messages, pièces jointes, lecture admin et timestamps.", "Dire que ce modèle représente toute la vie d'un ticket support."),
    ]
    for item in models:
        story += file_block(*item)

    story.append(PageBreak())
    story += section("16. Backend : sécurité et middlewares")
    middlewares = [
        ("backend/src/middleware/auth.js", "Middleware d'authentification.", "Lit le header Authorization Bearer, vérifie le JWT, charge l'utilisateur sans passwordHash et fournit req.user. requireRole limite certaines routes.", "Dire que le backend ne fait pas confiance au frontend : il revérifie le token et le rôle."),
        ("backend/src/middleware/errorHandler.js", "Gestion centralisée des erreurs.", "Renvoie un message propre et cache les détails pour les erreurs 500.", "Dire que cela évite de répéter try/catch dans la réponse finale."),
    ]
    for item in middlewares:
        story += file_block(*item)

    story += section("17. Backend : contrôleurs")
    controllers = [
        ("backend/src/controllers/auth.controller.js", "Logique d'authentification.", "Gère register, login, me, updateMe, forgotPassword et resetPassword avec bcrypt, JWT, token de reset et email.", "Dire que ce fichier contient les règles métier liées au compte."),
        ("backend/src/controllers/ticket.controller.js", "Logique métier des tickets.", "Crée un publicId, crée les tickets, liste selon rôle, change statut, ajoute notes/messages/pièces jointes, marque vu et envoie des emails.", "Dire que c'est le coeur du backend support."),
        ("backend/src/controllers/employee.controller.js", "Gestion des employés.", "Liste les admins/employés, crée un compte interne et le met à jour avec rôle, statut actif et mot de passe.", "Dire que seuls les admins peuvent utiliser ces actions."),
    ]
    for item in controllers:
        story += file_block(*item)

    story += section("18. Backend : routes")
    routes = [
        ("backend/src/routes/auth.routes.js", "Routes auth.", "Associe /register, /login, /forgot-password, /reset-password, /me et PATCH /me aux contrôleurs.", "Dire que les routes /me sont protégées par requireAuth."),
        ("backend/src/routes/ticket.routes.js", "Routes tickets.", "Protège toutes les routes par requireAuth, puis limite seen/status/notes aux employés/admins.", "Dire que le client peut créer/lire ses tickets et ajouter des messages/pièces jointes, mais pas changer le statut."),
        ("backend/src/routes/employee.routes.js", "Routes employés.", "Toutes les routes exigent requireAuth et requireRole('admin').", "Dire que la gestion du personnel est réservée à l'administrateur."),
    ]
    for item in routes:
        story += file_block(*item)

    story += section("19. Backend : services et scripts")
    services_backend = [
        ("backend/src/services/email.service.js", "Service email.", "Vérifie la configuration SMTP, crée le transport Nodemailer, envoie les emails ou log l'email si SMTP n'est pas configuré. appUrl construit les liens frontend.", "Dire que le projet ne plante pas si SMTP manque : il saute l'envoi proprement."),
        ("backend/src/scripts/create-admin.js", "Script de création admin.", "Lit les variables ADMIN_*, connecte MongoDB, hash le mot de passe et crée/met à jour le compte admin.", "Dire que c'est la méthode propre pour créer le vrai compte administrateur."),
    ]
    for item in services_backend:
        story += file_block(*item)

    story.append(PageBreak())
    story += section("20. Assets et fichiers publics")
    assets = [
        ("src/assets/pbxcom-logo-dark.png", "Logo utilisé en thème sombre.", "Affiché par BrandLogo quand la classe dark est active.", "Dire que le logo s'adapte au thème."),
        ("src/assets/pbxcom-logo-light.png", "Logo utilisé en thème clair.", "Affiché par BrandLogo en mode clair.", "Dire que cela garde une bonne lisibilité."),
        ("src/assets/hero.png", "Image de support visuel.", "Présente dans les assets, prête pour une page ou un écran visuel.", "Dire qu'elle fait partie des ressources graphiques."),
        ("src/assets/react.svg et src/assets/vite.svg", "Assets du template initial.", "Encore présents mais pas essentiels au fonctionnement PBxcom.", "Dire qu'ils peuvent être supprimés plus tard si on nettoie le projet."),
        ("public/favicon.png et public/favicon-64.png", "Icônes de l'onglet navigateur.", "Utilisées par index.html ou le navigateur pour l'identité visuelle.", "Dire que ce sont les petites icônes du site."),
        ("public/icons.svg", "Fichier SVG public.", "Ressource publique disponible depuis le navigateur.", "Dire qu'il peut servir d'asset graphique global."),
        (".DS_Store", "Fichiers système macOS.", "Créés automatiquement par Finder, sans rôle dans l'application.", "Dire qu'ils doivent idéalement être ignorés/supprimés du dépôt."),
    ]
    for item in assets:
        story += file_block(*item)

    story += section("21. Parcours à expliquer à l'encadrant")
    story += subsection("Parcours client")
    story += bullets(
        [
            "Le client se connecte ou crée un compte.",
            "Il ouvre Nouveau ticket.",
            "Il remplit ses informations : nom, prénom, société, numéro de marché, facture, téléphone, email, ville et description du problème.",
            "Il ajoute des pièces jointes si nécessaire.",
            "Le système crée un ticket numéroté et l'ajoute à son historique.",
            "Le client peut ensuite ouvrir le détail, suivre le statut et répondre.",
        ]
    )
    story += subsection("Parcours admin/employé")
    story += bullets(
        [
            "L'admin se connecte avec le compte PBxcom.",
            "Il voit les statistiques et la liste des tickets.",
            "Il ouvre un ticket : le système le marque comme vu.",
            "Il peut répondre au client, ajouter une note interne, joindre un fichier, changer le statut ou imprimer la fiche.",
            "Les changements apparaissent dans l'historique du ticket.",
        ]
    )

    story += section("22. Questions probables et réponses")
    qa = [
        ("Pourquoi React ?", "Parce que l'interface est composée de pages et composants réutilisables : formulaires, tableaux, badges, layouts. React rend cette organisation claire."),
        ("Pourquoi Zustand ?", "Pour partager facilement l'utilisateur connecté, les tickets, les notifications, la langue et le thème entre plusieurs pages sans passer les données manuellement partout."),
        ("Où sont stockées les données ?", "En mode démonstration, elles sont dans le localStorage du navigateur via Zustand persist. En mode production, le backend est prévu pour stocker les données dans MongoDB."),
        ("Pourquoi il y a un backend si le frontend marche seul ?", "Le frontend seul facilite la démonstration. Le backend prépare la vraie version : MongoDB, JWT, rôles, emails et comptes employés."),
        ("Comment la sécurité est gérée ?", "Côté frontend, ProtectedRoute bloque les pages selon le rôle. Côté backend, requireAuth vérifie le token JWT et requireRole vérifie les autorisations."),
        ("Pourquoi les mots de passe sont sécurisés ?", "Dans le backend, ils sont hashés avec bcrypt. On ne stocke pas le mot de passe original."),
        ("Comment les emails marchent ?", "Le backend utilise Nodemailer avec SMTP. Si SMTP n'est pas configuré, le service n'envoie pas l'email mais ne fait pas planter l'application."),
        ("Comment le ticket est tracé ?", "Chaque ticket contient history, messages, notes et timestamps. Les changements de statut et messages ajoutent des événements."),
        ("Quelle différence entre note et message ?", "Le message est une conversation visible client/support. La note interne est réservée à l'équipe support."),
        ("Pourquoi utiliser publicId ?", "Pour afficher un numéro simple comme 00001 au lieu de montrer l'identifiant MongoDB technique."),
        ("Qu'est-ce qui reste à améliorer ?", "Brancher définitivement le frontend sur l'API, ajouter validation backend avec Zod, pagination réelle, tests automatisés et nettoyage des fichiers template/.DS_Store."),
    ]
    for question, answer in qa:
        story.append(p(f"<b>Q : {question}</b>", "Body"))
        story.append(p(f"R : {answer}", "Body"))

    story += section("23. Points forts du projet")
    story += bullets(
        [
            "Séparation claire entre interface, état, services, backend et base de données.",
            "Deux espaces distincts : client et admin/employé.",
            "Gestion complète du cycle d'un ticket : création, lecture, statut, conversation, notes, pièces jointes, impression.",
            "Mode démonstration autonome sans base de données.",
            "Backend prêt pour une vraie mise en production avec MongoDB et emails.",
            "Interface responsive avec thème sombre/clair et support multilingue.",
        ]
    )

    story += section("24. Limites à connaître honnêtement")
    story += bullets(
        [
            "Le frontend utilise encore un fallback local ; pour une production complète, il faut forcer l'utilisation de l'API.",
            "Les notifications frontend sont simulées, même si le backend contient l'envoi email réel.",
            "La pagination dans AdminTickets est seulement visuelle pour l'instant.",
            "Certains fichiers du template initial comme react.svg/vite.svg ne sont pas nécessaires.",
            "Il faut ajouter plus de validation backend pour tous les champs de formulaire.",
        ]
    )

    story += section("25. Conclusion simple à dire")
    story.append(
        p(
            "Ce projet est une plateforme de gestion de tickets support pour PBxcom. Le client crée et suit ses demandes. "
            "L'équipe PBxcom traite ces demandes, change leur statut, répond, ajoute des notes internes et peut imprimer une fiche. "
            "Le frontend est prêt pour la démonstration grâce au stockage local, et le backend prépare la version réelle avec MongoDB, JWT, rôles et emails.",
            "Body",
        )
    )
    story.append(Spacer(1, 0.3 * cm))
    story.append(p("Phrase courte pour la soutenance :", "Heading2"))
    story.append(
        p(
            "« J'ai développé une application web de support qui centralise les demandes clients sous forme de tickets, "
            "avec un espace client, un espace administrateur, un suivi de statut, des conversations, des pièces jointes, "
            "des notifications et une architecture prête pour une base MongoDB. »",
            "Body",
        )
    )
    return story


def main():
    OUTPUT.parent.mkdir(exist_ok=True)
    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        rightMargin=1.6 * cm,
        leftMargin=1.6 * cm,
        topMargin=1.5 * cm,
        bottomMargin=1.8 * cm,
        title="Explication complète du projet PBxcom",
        author="Codex",
    )
    doc.build(build_story(), onFirstPage=add_page_number, onLaterPages=add_page_number)
    print(OUTPUT)


if __name__ == "__main__":
    main()
