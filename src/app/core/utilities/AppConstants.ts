import { environment } from 'src/environments/environment';

export class AppConstants {
  static CACHE_KEY_ALL_CONFIG: string = 'ALL_MODULE_CONFIG';
  static CACHE_KEY_RATE_LIMITER: string = 'RATE_LIMITER';
  
  static RATE_LIMITER_ALLOWED_IN_HOURS: number = 1;
  static RATE_LIMITER_ALLOWED_REQUESTS: number = 5;
  static CACHE_ENCODE_ENABLE: boolean = true;
  static FIREBASE_COLLECTION_MODULE: string = 'modules';

  static getAPIEndpoint(): string {
    return environment.BASE_API_URL;
  }
  static getFirebaseConfig(): any {
    return environment.firebaseConfig;
  }
  static getOpenAIConfig(): any {
    return environment.openAIConfig;
  }

  static SEARCH_PLACEHOLDER_DESC = [
    "Unleash the search ninja within u with a brief query that'll make the web bow in awe! 😄🔍",
    'Rock the search scene with a query so brief, AI will give you a virtual high-five! 😄🔍',
    "Transform your search mojo with a brief query that'll have search engines doing a double-take! 😄🔍",
    'Search smart, not hard! Keep it snappy and the internet will bow to your wit! 😄🔍',
  ];
}
