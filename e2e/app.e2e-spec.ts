import { FedexTntAdminPage } from './app.po';

describe('curri-fe App', () => {
  let page: FedexTntAdminPage;

  beforeEach(() => {
    page = new FedexTntAdminPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getHeaderText()).toEqual('Admin');
  });
});
