import { expect, test } from '@playwright/test';

test.describe('Fortrex launch experience', () => {
  test('keeps the centered hero and opens the registration form', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /WHERE TRADERS RISE/i })).toBeVisible();
    await page.getByRole('button', { name: /Join the Genesis List/i }).first().click();
    await expect(page.getByRole('heading', { name: 'Keep your name close.' })).toBeVisible();
    await expect(page.getByLabel('Mobile number')).toBeVisible();
    await expect(page.getByLabel('Email address')).toBeVisible();
  });

  test('shows inline invalid states for malformed email and mobile input', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Join the Genesis List/i }).first().click();
    const name = page.getByLabel('Full name');
    const mobile = page.getByLabel('Mobile number');
    const email = page.getByLabel('Email address');
    await name.fill('A');
    await name.blur();
    await mobile.fill('12');
    await mobile.blur();
    await email.fill('not-an-email');
    await email.blur();
    await expect(name).toHaveAttribute('aria-invalid', 'true');
    await expect(page.getByText('Enter at least 2 characters.')).toBeVisible();
    await expect(mobile).toHaveAttribute('aria-invalid', 'true');
    await expect(email).toHaveAttribute('aria-invalid', 'true');
    await expect(page.getByText('Enter a valid Indian mobile number.')).toBeVisible();
    await expect(page.getByText('Enter a valid email address.')).toBeVisible();
  });

  test('shows honest Community cards with current availability status', async ({ page }) => {
    await page.goto('/');
    const community = page.locator('#community');
    await community.scrollIntoViewIfNeeded();
    const cards = community.locator('.neon-social-card');
    await expect(cards).toHaveCount(4);
    await expect(cards.first()).toContainText('Coming soon');
    await expect(cards.first()).toContainText('Opening soon');
    await expect(cards.first().getByRole('button')).toHaveCount(0);
  });

  test('shows the honest Community launch-soon banner and availability copy', async ({ page }) => {
    await page.goto('/');
    const community = page.locator('#community');
    await community.scrollIntoViewIfNeeded();
    await expect(community.getByText('OFFICIAL CHANNELS LAUNCHING SOON', { exact: true })).toBeVisible();
    await expect(community.locator('.neon-social-card')).toHaveCount(4);
    await expect(community.getByText('Join the Genesis List to be notified when Fortrex opens its official community channels.', { exact: true })).toBeVisible();
  });

  test('shows sticky quick-access navigation on mobile', async ({ page }, testInfo) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Quick access' });
    if (testInfo.project.name === 'mobile-chromium') {
      await expect(nav).toBeVisible();
      await expect(nav.getByRole('button', { name: /Register for early access/i })).toBeVisible();
      await expect(nav.getByRole('button', { name: /Community/i })).toBeVisible();
      await expect(nav.locator('.notification-badge')).toHaveAttribute('aria-label', '3 new community updates');
    } else {
      await expect(nav).toBeHidden();
    }
  });

  test('opens the slide-up Community preview from mobile navigation', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile-chromium', 'Community preview is mobile-only');
    await page.goto('/');
    await page.getByRole('button', { name: 'Open community preview' }).click();
    await expect(page.getByRole('dialog', { name: 'Stay close.' })).toBeVisible();
    await expect(page.getByRole('dialog', { name: 'Stay close.' }).getByText('The Room', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Close community preview' }).click();
    await expect(page.getByRole('dialog', { name: 'Stay close.' })).toBeHidden();
  });

  test('reveals a personalized welcome after successful registration', async ({ page }, testInfo) => {
    test.setTimeout(40000);
    await page.route('**/api/trpc/genesis.register*', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ result: { data: { json: { id: 84, name: 'Asha Mehta', email: 'asha@example.com', mobile: '+919876543210', referralCode: 'FTX84' } } } }) });
    });
    await page.goto('/');
    await expect(page.getByRole('status', { name: 'Loading Fortrex' })).toBeHidden({ timeout: 6000 });
    await page.getByRole('button', { name: /Join the Genesis List/i }).first().click();
    await page.getByLabel('Full name').fill('Asha Mehta');
    await page.getByLabel('Mobile number').fill('+91 98765 43210');
    await page.getByLabel('Email address').fill('asha@example.com');
    await page.getByRole('button', { name: /Join the Genesis List/i }).last().click();
    await expect(page.getByRole('main')).not.toContainText(/Welcome, Asha|Transmission received|Copy Invite|Share Status|Explore More/i);
    await page.getByRole('button', { name: 'Close registration' }).click();
    if (testInfo.project.name === 'mobile-chromium') {
      const profileButton = page.getByRole('button', { name: 'Open your Fortrex profile' });
      await expect(profileButton).toBeVisible();
      await profileButton.click({ force: true });
      const profileMenu = page.getByRole('menu', { name: 'Profile options' });
      await expect(profileMenu).toBeVisible();
      await expect(profileMenu.getByText('Welcome, Asha', { exact: true })).toBeVisible();
      const profileBox = await profileMenu.boundingBox();
      expect(profileBox).not.toBeNull();
      expect(Math.abs((profileBox?.x ?? 0) + (profileBox?.width ?? 0) / 2 - 390 / 2)).toBeLessThan(18);
      await expect(page.locator('.profile-avatar').first()).toBeVisible();
      await expect(page.getByRole('menuitem', { name: 'Edit Profile' })).toBeVisible();
      await expect(page.getByRole('menuitem', { name: 'Settings' })).toBeVisible();
      await expect(page.getByRole('menuitem', { name: 'Logout' })).toBeVisible();
      await page.getByRole('menuitem', { name: 'Edit Profile' }).click();
      await expect(page.getByRole('dialog', { name: 'Edit Profile' })).toBeVisible();
      await page.getByLabel('Upload avatar image').setInputFiles({ name: 'avatar.gif', mimeType: 'image/gif', buffer: Buffer.from('R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==', 'base64') });
      await expect(page.getByText('Choose a PNG, JPEG, or WebP image.')).toBeVisible();
      await page.getByLabel('Upload avatar image').setInputFiles({ name: 'avatar.png', mimeType: 'image/png', buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=', 'base64') });
      await expect(page.getByRole('dialog', { name: 'Crop your avatar' })).toBeVisible();
      await expect(page.getByRole('dialog', { name: 'Crop your avatar' }).locator('img')).toHaveAttribute('src', /^data:image\/webp/);
      await page.getByRole('button', { name: 'Use Avatar' }).click();
      await expect(page.locator('.profile-edit-dialog .profile-avatar-image')).toBeVisible();
      await page.getByLabel('Username').fill('Asha Prime');
      await page.getByLabel('Bio').fill('short');
      await expect(page.getByText('5/180')).toBeVisible();
      await page.getByRole('button', { name: 'Save Profile' }).click();
      await expect(page.getByText('Bio must be at least 10 characters.')).toBeVisible();
      await page.getByLabel('Bio').fill('Ready for the first reveal.');
      await page.getByRole('button', { name: 'Save Profile' }).click();
      await page.waitForTimeout(500);
    } else {
      const desktopProfile = page.getByRole('button', { name: 'Open desktop profile settings' });
      await expect(desktopProfile).toBeVisible();
      await desktopProfile.click();
      await expect(page.getByRole('dialog', { name: 'Edit Profile' })).toBeVisible();
      await expect(page.getByText(/0?\d+\/180/)).toBeVisible();
      await page.getByLabel('Bio').fill('Desktop profile ready.');
      await page.getByRole('button', { name: 'Save Profile' }).click();
      await expect(page.getByRole('dialog', { name: 'Edit Profile' })).toBeHidden();
    }
  });

  test('keeps the Fortrex experience in the dark obsidian theme', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('theme', 'light'));
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/dark/);
  await expect(page.locator('.fortrex-shell')).toBeVisible();
  await expect(page.getByText('Dark mode')).toHaveCount(0);
});

test('renders centered hero content on a mobile viewport', async ({ page }) => {
    await page.goto('/');
    const hero = page.locator('main > section').first();
    await expect(hero).toHaveCSS('text-align', 'center');
    await expect(page.getByRole('heading', { name: /WHERE TRADERS RISE/i })).toBeVisible();
  });
});


test('shows the counter timestamp tooltip and realtime Genesis channel after the pass removal', async ({ page }) => {
  await page.goto('/');
  const counter = page.locator('.counter-tooltip-anchor');
  await expect(counter).toHaveAttribute('data-tooltip', /.+/);
  await counter.focus();
  await expect(page.locator('#genesis-counter-last-update')).toBeVisible();
  const handshake = await page.evaluate(() => new Promise<string>((resolve, reject) => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socket = new WebSocket(`${protocol}//${window.location.host}/ws/genesis`);
    const timeout = window.setTimeout(() => { socket.close(); reject(new Error('Genesis WebSocket handshake timed out')); }, 5000);
    socket.onmessage = (event) => { const message = JSON.parse(event.data); if (message.type === 'genesis-ready') { window.clearTimeout(timeout); socket.close(); resolve(message.type); } };
    socket.onerror = () => { window.clearTimeout(timeout); reject(new Error('Genesis WebSocket connection failed')); };
  }));
  expect(handshake).toBe('genesis-ready');
});


test('shows the check-your-email recovery state and resend cooldown', async ({ page }) => {
  await page.route('**/api/trpc/genesis.lookup*', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ result: { data: { json: { id: 84, name: 'Asha Mehta', email: 'asha@example.com', mobile: '+919876543210', referralCode: 'FTX84' } } } }) });
  });
  await page.goto('/');
  await page.getByRole('button', { name: /Join the Genesis List/i }).first().click();
  await page.getByRole('button', { name: 'Already registered? Recover with email' }).click();
  const recovery = page.getByRole('dialog', { name: 'Find your place.' });
  await recovery.getByLabel('Registration email').fill('asha@example.com');
  await recovery.getByRole('button', { name: 'Continue' }).click();
  await expect(recovery.getByText('Check your email')).toBeVisible();
  const resend = recovery.getByRole('button', { name: /Resend available in 60s/ });
  await expect(resend).toBeDisabled();
  await recovery.getByRole('button', { name: 'Close recovery' }).click();
  await expect(recovery).toBeHidden();
});


test('keeps recovery keyboard focus contained and restores it on close', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Join the Genesis List/i }).first().click();
  const recoveryEntry = page.getByRole('button', { name: 'Already registered? Recover with email' });
  await recoveryEntry.click();
  const recovery = page.getByRole('dialog', { name: 'Find your place.' });
  await expect(recovery.getByLabel('Registration email')).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(recovery.getByRole('button', { name: 'Close recovery' })).toBeFocused();
  await recovery.getByRole('button', { name: 'Close recovery' }).click();
  await expect(recoveryEntry).toBeFocused();
});

test('shows footer contact and legal placeholder links without a navigation wordmark', async ({ page }) => {
  await page.goto('/');
  const header = page.locator('header').first();
  await expect(header.locator('img[alt="FORTREX crown"]')).toBeVisible();
  await expect(header).not.toContainText('FORTREX FX');
  await expect(page.getByRole('link', { name: 'Contact: hello@fortrexfx.com' })).toHaveAttribute('href', 'mailto:hello@fortrexfx.com');
  await expect(page.getByRole('link', { name: 'Terms of Service' })).toHaveAttribute('href', '#terms');
  await expect(page.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', '#privacy');
  await page.getByRole('button', { name: 'Contact Us' }).click();
  const contact = page.getByRole('dialog', { name: 'Contact Us' });
  await expect(contact).toBeVisible();
  await contact.getByPlaceholder('How can we help?').fill('A concise support question.');
  await expect(contact.getByRole('link', { name: 'Open email' })).toHaveAttribute('href', /mailto:hello@fortrexfx.com/);
  await contact.getByRole('button', { name: 'Close Contact Us' }).click();
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(page.getByRole('button', { name: 'Scroll to top' })).toBeVisible();
});


test('handles the second-pass launch audit fixes without opening signup unexpectedly', async ({ page }) => {
  await page.goto('/');
  const consent = page.getByRole('dialog', { name: 'Analytics consent' });
  if (await consent.isVisible()) await consent.getByRole('button', { name: 'Decline' }).click();
  const community = page.locator('#community');
  await community.scrollIntoViewIfNeeded();
  await community.getByRole('button', { name: 'Active' }).click();
  await expect(community.getByRole('status')).toContainText('No active channels yet.');
  await page.getByRole('button', { name: 'Discord placeholder, join for updates' }).click();
  await expect(page.getByText('Discord is launching soon')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Keep your name close.' })).toHaveCount(0);
});

test('updates the Contact Us character counter as the message changes', async ({ page }) => {
  await page.goto('/');
  const consent = page.getByRole('dialog', { name: 'Analytics consent' });
  if (await consent.isVisible()) await consent.getByRole('button', { name: 'Decline' }).click();
  await page.getByRole('button', { name: 'Contact Us' }).click();
  const contact = page.getByRole('dialog', { name: 'Contact Us' });
  await contact.getByPlaceholder('How can we help?').fill('Counter check');
  await expect(contact.getByText('13/600')).toBeVisible();
});
