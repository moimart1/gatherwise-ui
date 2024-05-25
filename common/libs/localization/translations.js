import { roleEnum } from '../authorization'
import { SubscriptionEnum } from '../constants'

export const langEnum = {
  en: 'en',
  fr: 'fr',
  es: 'es',
}

export default {
  english: {
    [langEnum.fr]: 'anglais',
    [langEnum.es]: 'inglés',
  },
  french: {
    [langEnum.fr]: 'français',
    [langEnum.es]: 'francés',
  },
  spanish: {
    [langEnum.fr]: 'espagnol',
    [langEnum.es]: 'español',
  },
  home: {
    [langEnum.fr]: 'accueil',
    [langEnum.es]: 'inicio',
  },
  gateway: {
    [langEnum.fr]: 'passerelle',
    [langEnum.es]: 'puerta de enlace',
  },
  gateways: {
    [langEnum.fr]: 'passerelles',
    [langEnum.es]: 'puertas de enlace',
  },
  machine: {
    [langEnum.fr]: 'machine',
    [langEnum.es]: 'máquina',
  },
  machines: {
    [langEnum.fr]: 'machines',
    [langEnum.es]: 'máquinas',
  },
  delete: {
    [langEnum.fr]: 'supprimer',
    [langEnum.es]: 'eliminar',
  },
  redirect: {
    [langEnum.fr]: 'redirection',
    [langEnum.es]: 'redirigir',
  },
  'install docker': {
    [langEnum.fr]: 'install docker', // TODO
    [langEnum.es]: 'install docker', // TODO
  },
  'you can install docker by following this ': {
    [langEnum.fr]: 'you can install docker by following this ', // TODO
    [langEnum.es]: 'you can install docker by following this ', // TODO
  },
  'official documentation': {
    [langEnum.fr]: 'official documentation', // TODO
    [langEnum.es]: 'official documentation', // TODO
  },
  'get link': {
    [langEnum.fr]: 'obtenir le lien',
    [langEnum.es]: 'get link', // TODO
  },
  loading: {
    [langEnum.fr]: 'chargement',
    [langEnum.es]: 'loading', // TODO
  },
  'getting started': {
    [langEnum.fr]: 'getting started', // TODO
    [langEnum.es]: 'getting started', // TODO
  },
  'return to homepage': {
    [langEnum.fr]: "retourner à l'accueil",
    [langEnum.es]: 'return to homepage', // TODO
  },
  close: {
    [langEnum.fr]: 'fermer',
    [langEnum.es]: 'close', // TODO
  },
  'add user': {
    [langEnum.fr]: 'ajouter un utilisateur',
    [langEnum.es]: 'add user', // TODO
  },
  username: {
    [langEnum.fr]: "nom d'utilisateur",
    [langEnum.es]: 'username', // TODO
  },
  'first name': {
    [langEnum.fr]: 'prénom',
    [langEnum.es]: 'first name', // TODO
  },
  'last name': {
    [langEnum.fr]: 'nom',
    [langEnum.es]: 'last name', // TODO
  },
  roles: {
    [langEnum.fr]: 'roles',
    [langEnum.es]: 'roles', // TODO
  },
  create: {
    [langEnum.fr]: 'créer',
    [langEnum.es]: 'create', // TODO
  },
  'created at': {
    [langEnum.fr]: 'créé le',
    [langEnum.es]: 'created at', // TODO
  },
  'updated at': {
    [langEnum.fr]: 'mis à jour le',
    [langEnum.es]: 'updated at', // TODO
  },
  forbidden: {
    [langEnum.fr]: 'interdit',
    [langEnum.es]: 'forbidden', // TODO
  },
  'switch to': {
    [langEnum.fr]: 'basculer vers',
    [langEnum.es]: 'switch to', // TODO
  },
  url: {
    [langEnum.fr]: 'url', // TODO
    [langEnum.es]: 'url', // TODO
  },
  email: {
    [langEnum.fr]: 'courriel',
    [langEnum.es]: 'email', // TODO
  },
  ID: {
    [langEnum.fr]: 'ID',
    [langEnum.es]: 'ID',
  },
  save: {
    [langEnum.fr]: 'sauvegarder',
    [langEnum.es]: 'save', // TODO
  },
  'nothing to show': {
    [langEnum.fr]: 'rien à afficher',
    [langEnum.es]: 'nothing to show', // TODO
  },
  copy: {
    [langEnum.fr]: 'copie',
    [langEnum.es]: 'copy', // TODO
  },
  copied: {
    [langEnum.fr]: 'copié',
    [langEnum.es]: 'copy', // TODO
  },
  [roleEnum.User]: {
    [langEnum.en]: 'user',
    [langEnum.fr]: 'utilisateur',
    [langEnum.es]: 'user', // TODO
  },
  [roleEnum.CompanyOperator]: {
    [langEnum.en]: 'operator',
    [langEnum.fr]: 'opérateur',
    [langEnum.es]: 'operator', // TODO
  },
  [roleEnum.EdgeAdmin]: {
    [langEnum.en]: 'Edge admin',
    [langEnum.fr]: 'admin Edge',
    [langEnum.es]: 'Edge admin', // TODO
  },
  [roleEnum.PartnerAdmin]: {
    [langEnum.en]: 'partner admin',
    [langEnum.fr]: 'admin partenaire',
    [langEnum.es]: 'partner admin', // TODO
  },
  [roleEnum.CompanyAdmin]: {
    [langEnum.en]: 'company admin',
    [langEnum.fr]: 'admin de la compagnie',
    [langEnum.es]: 'company admin', // TODO
  },
  [roleEnum.SuperAdmin]: {
    [langEnum.en]: 'super admin',
    [langEnum.fr]: 'super admin',
    [langEnum.es]: 'super admin', // TODO
  },
  [SubscriptionEnum.Free]: {
    [langEnum.en]: 'free',
    [langEnum.fr]: 'gratuit',
    [langEnum.es]: 'free', // TODO
  },
  [SubscriptionEnum.EdgePlatform]: {
    [langEnum.en]: 'Edge platform',
    [langEnum.fr]: 'plateforme Edge',
    [langEnum.es]: 'plataforma Edge',
  },
  [SubscriptionEnum.Standard]: {
    [langEnum.en]: 'standard',
    [langEnum.fr]: 'standard',
    [langEnum.es]: 'standard', // TODO
  },
  legacy: {
    [langEnum.fr]: 'archive',
    [langEnum.es]: 'legacy', // TODO
  },
  name: {
    [langEnum.fr]: 'nom',
    [langEnum.es]: 'name', // TODO
  },
  information: {
    [langEnum.fr]: 'information',
    [langEnum.es]: 'information', // TODO
  },
  machineManufacturer: {
    [langEnum.en]: 'machine manufacturer',
    [langEnum.fr]: 'fabricant de la machine',
    [langEnum.es]: 'machine manufacturer',
  },
  machineModel: {
    [langEnum.en]: 'machine model',
    [langEnum.fr]: 'modèle de la machine',
    [langEnum.es]: 'machine model', // TODO
  },
  machineSerialNumber: {
    [langEnum.en]: 'machine serial number',
    [langEnum.fr]: 'numéro de série de la machine',
    [langEnum.es]: 'machine serial number', // TODO
  },
  machineYear: {
    [langEnum.en]: 'machine year',
    [langEnum.fr]: 'année de la machine',
    [langEnum.es]: 'machine year', // TODO
  },
  controllerManufacturer: {
    [langEnum.en]: 'controller manufacturer',
    [langEnum.fr]: 'fabricant du contrôleur',
    [langEnum.es]: 'controllerManufacturer', // TODO
  },
  controllerModel: {
    [langEnum.en]: 'controller model',
    [langEnum.fr]: 'model du contrôleur',
    [langEnum.es]: 'controller manufacturer', // TODO
  },
  controllerSerialNumber: {
    [langEnum.en]: 'controller serial number',
    [langEnum.fr]: 'numéro de série du contrôleur',
    [langEnum.es]: 'controller serial number', // TODO
  },
  settings: {
    [langEnum.fr]: 'réglages',
    [langEnum.es]: 'ajustes',
  },
  'temporary password': {
    [langEnum.fr]: 'mot de passe temporaire',
    [langEnum.es]: 'contraseña temporal',
  },
  'open in e-mail': {
    [langEnum.fr]: "ouvrir dans l'e-mail",
    [langEnum.es]: 'abrir en el correo electrónico',
  },

  'company name': {
    [langEnum.fr]: "nom de l'entreprise",
    [langEnum.es]: 'nombre de la empresa',
  },
  'slug name': {
    [langEnum.fr]: 'identifiant',
    [langEnum.es]: 'identificador',
  },
  logout: {
    [langEnum.fr]: 'se déconnecter',
    [langEnum.es]: 'logout',
  },
  modules: {
    [langEnum.fr]: 'modules',
    [langEnum.es]: 'módulos',
  },
  'machine-monitoring': {
    [langEnum.en]: 'machine monitoring',
    [langEnum.fr]: 'surveillance des machines',
    [langEnum.es]: 'monitoreo de máquinas',
  },
  'optimal-path-system': {
    [langEnum.en]: 'optimal path system',
    [langEnum.fr]: 'système de chemin optimal',
    [langEnum.es]: 'sistema de ruta óptima',
  },
  'cnc-program-optimizer': {
    [langEnum.en]: 'CNC program optimizer',
    [langEnum.fr]: 'optimiseur de programme CNC',
    [langEnum.es]: 'optimizador de programa CNC',
  },
  quotas: { [langEnum.fr]: 'quotas', [langEnum.es]: 'cuotas' },
  users: { [langEnum.fr]: 'utilisateurs', [langEnum.es]: 'usuarios' },
  total: { [langEnum.fr]: 'total', [langEnum.es]: 'total' },
  edit: { [langEnum.fr]: 'modifier', [langEnum.es]: 'editar' },
  'edit quota': { [langEnum.fr]: 'modifier le quota', [langEnum.es]: 'editar cuota' },
  'something wrong happens': { [langEnum.fr]: 'quelque chose de mal se passe', [langEnum.es]: 'algo salió mal' },
  overview: { [langEnum.fr]: 'aperçu', [langEnum.es]: 'visión general' },
  administration: { [langEnum.fr]: 'administration', [langEnum.es]: 'administración' },
  'manage users, billing, global settings, and more for all the services in your company.': {
    [langEnum.fr]:
      'gérer les utilisateurs, la facturation, les paramètres globaux, et plus encore pour tous les services de votre entreprise.',
    [langEnum.es]: 'gestionar usuarios, facturación, configuraciones globales y más para todos los servicios de su empresa.',
  },
  'quick actions': { [langEnum.fr]: 'actions rapides', [langEnum.es]: 'acciones rápidas' },
  'add a new machine': { [langEnum.fr]: 'ajouter une nouvelle machine', [langEnum.es]: 'agregar una nueva máquina' },
  'show the list of machine': { [langEnum.fr]: 'afficher la liste des machines', [langEnum.es]: 'mostrar la lista de máquinas' },
  app: { [langEnum.fr]: 'application', [langEnum.es]: 'aplicación' },
  'see the dashboard': { [langEnum.fr]: 'voir le tableau de bord', [langEnum.es]: 'ver el tablero' },
  'create a new program': { [langEnum.fr]: 'créer un nouveau programme', [langEnum.es]: 'crear un nuevo programa' },
  'create a new planing': { [langEnum.fr]: 'créer un nouveau plan', [langEnum.es]: 'crear una nueva planificación' },
  'add a new user': { [langEnum.fr]: 'ajouter un nouvel utilisateur', [langEnum.es]: 'agregar un nuevo usuario' },
  'show the list of user': { [langEnum.fr]: 'afficher la liste des utilisateurs', [langEnum.es]: 'mostrar la lista de usuarios' },
  'update company name': { [langEnum.fr]: "mettre à jour le nom de l'entreprise", [langEnum.es]: 'actualizar nombre de empresa' },
  'show expert information': {
    [langEnum.fr]: "afficher les informations d'expert",
    [langEnum.es]: 'mostrar información de expertos',
  },
  'my companies': { [langEnum.fr]: 'mes entreprises', [langEnum.es]: 'mis empresas' },
  'managed by': { [langEnum.fr]: 'géré par', [langEnum.es]: 'gestionado por' },
  global: { [langEnum.fr]: 'global', [langEnum.es]: 'global' },
  'when call': {
    [langEnum.fr]: "pendant l'appel",
    [langEnum.es]: 'when call',
  },
  note: {
    [langEnum.fr]: 'note',
    [langEnum.es]: 'note',
  },
  'with message': {
    [langEnum.fr]: 'avec le message',
    [langEnum.es]: 'with message',
  },
}
