import { Test123Page } from './app.po';

describe('test123 App', () => {
  let page: Test123Page;

  beforeEach(() => {
    page = new Test123Page();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
