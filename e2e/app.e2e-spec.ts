import { TimesheetsPage } from './app.po';

describe('timesheets App', function() {
  let page: TimesheetsPage;

  beforeEach(() => {
    page = new TimesheetsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
