import { useEffect } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const languages = [
  { id: 'en', label: 'English' },
  { id: 'fr', label: 'Francais' },
  { id: 'ar', label: 'العربية' },
]

export const messages = {
  en: {
    informationForm: 'Information form',
    settings: 'Settings',
    supportTitle: 'PBxcom support',
    supportText: 'Submit your information and our team will handle the rest.',
    clientInfoEyebrow: 'Client information',
    clientInfoTitle: 'Fill in your information',
    clientInfoDescription:
      'Complete the form below and PBxcom will receive it directly. Your employee support team will manage the request internally.',
    nom: 'Nom',
    prenom: 'Prenom',
    societes: 'Societes',
    nMarche: 'N marche',
    nFacture: 'N facture',
    telephone: 'N telephone',
    mail: 'Mail',
    ville: 'Ville',
    submitInformation: 'Submit information',
    required: 'Required',
    invalidEmail: 'Use a valid email',
    invalidPhone: 'Use a valid phone number',
    fixFields: 'Please fix the highlighted fields.',
    sentInfo: 'Information sent to PBxcom.',
    reference: 'Reference',
    settingsEyebrow: 'Client settings',
    settingsTitle: 'Account settings',
    settingsDescription: 'Update your account information, password, and preferred language.',
    profileCard: 'Profile information',
    fullName: 'Full name',
    company: 'Company',
    email: 'Email',
    passwordCard: 'Security code',
    newPassword: 'New code / password',
    leaveBlank: 'Leave blank to keep the current code.',
    languageCard: 'Language',
    preferredLanguage: 'Preferred language',
    saveSettings: 'Save settings',
    settingsSaved: 'Settings updated successfully.',
  },
  fr: {
    informationForm: 'Formulaire',
    settings: 'Parametres',
    supportTitle: 'Support PBxcom',
    supportText: 'Envoyez vos informations et notre equipe s occupe du reste.',
    clientInfoEyebrow: 'Informations client',
    clientInfoTitle: 'Remplissez vos informations',
    clientInfoDescription:
      'Completez le formulaire ci-dessous et PBxcom le recevra directement. Notre equipe gerera la demande en interne.',
    nom: 'Nom',
    prenom: 'Prenom',
    societes: 'Societes',
    nMarche: 'N marche',
    nFacture: 'N facture',
    telephone: 'N telephone',
    mail: 'Mail',
    ville: 'Ville',
    submitInformation: 'Envoyer les informations',
    required: 'Obligatoire',
    invalidEmail: 'Utilisez un email valide',
    invalidPhone: 'Utilisez un numero de telephone valide',
    fixFields: 'Veuillez corriger les champs marques.',
    sentInfo: 'Informations envoyees a PBxcom.',
    reference: 'Reference',
    settingsEyebrow: 'Parametres client',
    settingsTitle: 'Parametres du compte',
    settingsDescription: 'Modifiez vos informations, votre code et votre langue preferee.',
    profileCard: 'Informations du profil',
    fullName: 'Nom complet',
    company: 'Societe',
    email: 'Email',
    passwordCard: 'Code de securite',
    newPassword: 'Nouveau code / mot de passe',
    leaveBlank: 'Laissez vide pour garder le code actuel.',
    languageCard: 'Langue',
    preferredLanguage: 'Langue preferee',
    saveSettings: 'Enregistrer',
    settingsSaved: 'Parametres mis a jour.',
  },
  ar: {
    informationForm: 'استمارة المعلومات',
    settings: 'الإعدادات',
    supportTitle: 'دعم PBxcom',
    supportText: 'أرسل معلوماتك وسيتكفل فريقنا بالباقي.',
    clientInfoEyebrow: 'معلومات العميل',
    clientInfoTitle: 'املأ معلوماتك',
    clientInfoDescription: 'أكمل الاستمارة أدناه وستصل مباشرة إلى PBxcom. سيتولى فريق الدعم معالجة الطلب داخليا.',
    nom: 'الاسم العائلي',
    prenom: 'الاسم الشخصي',
    societes: 'الشركة',
    nMarche: 'رقم الصفقة',
    nFacture: 'رقم الفاتورة',
    telephone: 'رقم الهاتف',
    mail: 'البريد الإلكتروني',
    ville: 'المدينة',
    submitInformation: 'إرسال المعلومات',
    required: 'مطلوب',
    invalidEmail: 'أدخل بريدا إلكترونيا صحيحا',
    invalidPhone: 'أدخل رقم هاتف صحيحا',
    fixFields: 'يرجى تصحيح الحقول المحددة.',
    sentInfo: 'تم إرسال المعلومات إلى PBxcom.',
    reference: 'المرجع',
    settingsEyebrow: 'إعدادات العميل',
    settingsTitle: 'إعدادات الحساب',
    settingsDescription: 'قم بتحديث معلومات الحساب والرمز واللغة المفضلة.',
    profileCard: 'معلومات الحساب',
    fullName: 'الاسم الكامل',
    company: 'الشركة',
    email: 'البريد الإلكتروني',
    passwordCard: 'رمز الأمان',
    newPassword: 'رمز / كلمة مرور جديدة',
    leaveBlank: 'اتركه فارغا للاحتفاظ بالرمز الحالي.',
    languageCard: 'اللغة',
    preferredLanguage: 'اللغة المفضلة',
    saveSettings: 'حفظ الإعدادات',
    settingsSaved: 'تم تحديث الإعدادات بنجاح.',
  },
}

export const useLanguageStore = create(
  persist(
    (set) => ({
      language: 'en',
      setLanguage: (language) => set({ language }),
    }),
    { name: 'pbxcom-language' },
  ),
)

export function useTranslation() {
  const language = useLanguageStore((state) => state.language)
  return {
    language,
    t: messages[language] ?? messages.en,
  }
}

export function useLanguageBootstrap() {
  const language = useLanguageStore((state) => state.language)

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
  }, [language])
}
