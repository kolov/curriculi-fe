import { browser, by, element } from 'protractor';

export class FedexTntAdminPage {
  navigateTo() {
    return browser.get('/');
  }

  getHeaderText() {
    return element(by.css('bat-root h1')).getText();
  }
}
