export interface Language {
  id: number;
  code: string;
  name: string;
  isDefault: boolean;
  isActive: boolean;
}

export interface LanguageSettings {
  id: number;
  code: string;
  name: string;
  nativeName: string;
  isRTL: boolean;
  isActive: boolean;
  isDefault: boolean; // Add this line

}