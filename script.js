/**
 * AutoSite Client Interaction Engine (Vanilla JS)
 */
document.addEventListener('DOMContentLoaded', function () {
  // 1. Mobile Menu Toggle
  var hamburger = document.getElementById('hamburger-toggle');
  var mobileNav = document.getElementById('mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      var isOpen = mobileNav.classList.contains('open');
      if (isOpen) {
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      } else {
        mobileNav.classList.add('open');
        hamburger.setAttribute('aria-expanded', 'true');
      }
    });
  }

  // 2. Dynamic Year Update
  var yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 3. Contact Form Submission (Validation & Client feedback)
  var contactForm = document.getElementById('lead-contact-form');
  var formAlert = document.getElementById('form-alert-box');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var nameInput = contactForm.querySelector('input[name="full_name"]');
      var emailInput = contactForm.querySelector('input[name="email"]');
      var phoneInput = contactForm.querySelector('input[name="phone"]');

      var name = nameInput ? nameInput.value.trim() : '';
      var contactMethod = (emailInput && emailInput.value.trim()) || (phoneInput && phoneInput.value.trim());

      if (!name) {
        if (formAlert) {
          formAlert.innerHTML = '<strong>Notice:</strong> Please provide your full name.';
          formAlert.style.display = 'block';
        }
        return;
      }

      if (!contactMethod) {
        if (formAlert) {
          formAlert.innerHTML = '<strong>Notice:</strong> Please provide either a phone number or email address.';
          formAlert.style.display = 'block';
        }
        return;
      }

      // Success Display
      if (formAlert) {
        formAlert.innerHTML = '<strong>Thank you, ' + name + '!</strong> Your inquiry has been submitted successfully. We will review your request and get back to you shortly.';
        formAlert.style.display = 'block';
        contactForm.reset();

        formAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        setTimeout(function () {
          formAlert.style.display = 'none';
        }, 8000);
      }
    });
  }

  // 4. Website Claim & Unlock Widget Engine
  (function initClaimWidget() {
    var projectId = document.body.getAttribute('data-project-id');
    if (!projectId) {
      var match = window.location.pathname.match(/\/(?:sites|preview)\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) projectId = match[1];
    }
    if (!projectId) return;

    // Check if widget was disabled explicitly via attribute
    if (document.body.getAttribute('data-claim-disabled') === 'true') return;

    // Fetch dynamic claim details & eligibility from backend
    fetch('/api/claim/' + encodeURIComponent(projectId))
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (!data || !data.eligible) {
          // If already claimed or not eligible, don't show sales claim widget on production/claimed site
          return;
        }

        renderClaimWidget(data);
      })
      .catch(function (err) {
        console.warn('[AutoSite Claim Widget Notice]:', err);
      });

    function renderClaimWidget(claimData) {
      var minPriceCents = 1499;
      var suggestedPriceCents = 1499;
      var minPriceDollars = 14.99;
      var suggestedDollars = 14.99;

      // 1. Create Floating Button
      var floatingBtn = document.createElement('button');
      floatingBtn.id = 'autosite-claim-widget-btn';
      floatingBtn.setAttribute('type', 'button');
      floatingBtn.setAttribute('aria-haspopup', 'dialog');
      floatingBtn.setAttribute('aria-expanded', 'false');
      floatingBtn.setAttribute('aria-label', 'Claim This Site - Make this website yours');
      floatingBtn.innerHTML = 
        '<span class="autosite-claim-dot-indicator"></span>' +
        '<span class="autosite-claim-btn-labels">' +
          '<span class="autosite-claim-btn-main">Claim This Site</span>' +
          '<span class="autosite-claim-btn-sub">Make this website yours</span>' +
        '</span>';

      document.body.appendChild(floatingBtn);

      // 2. Create Overlay
      var overlay = document.createElement('div');
      overlay.id = 'autosite-claim-overlay';
      overlay.setAttribute('aria-hidden', 'true');
      document.body.appendChild(overlay);

      // 3. Create Drawer Panel
      var drawer = document.createElement('div');
      drawer.id = 'autosite-claim-drawer';
      drawer.setAttribute('role', 'dialog');
      drawer.setAttribute('aria-modal', 'true');
      drawer.setAttribute('aria-labelledby', 'autosite-claim-heading');
      drawer.setAttribute('tabindex', '-1');

      drawer.innerHTML = 
        '<div class="autosite-claim-drawer-header">' +
          '<div style="font-weight:900; font-size:14px; color:#0f172a;">Claim This Website</div>' +
          '<button type="button" class="autosite-claim-close-btn" id="autosite-claim-close-btn" aria-label="Close claim panel">&times;</button>' +
        '</div>' +
        '<div class="autosite-claim-drawer-content">' +
          '<div class="autosite-claim-hero">' +
            '<h2 id="autosite-claim-heading">Like this website? Make it yours.</h2>' +
            '<p>Claim this custom-crafted website today with a one-time payment. What would you pay to make this website yours? For a limited time, unlock full commercial ownership for just $14.99 USD.</p>' +
          '</div>' +
          '<div class="autosite-claim-biz-card">' +
            '<div>' +
              '<div class="autosite-claim-biz-name">' + (claimData.businessName || 'Business Website') + '</div>' +
              '<div class="autosite-claim-biz-meta">' + (claimData.category || 'Local Business') + ' • ' + (claimData.location || '') + '</div>' +
            '</div>' +
            '<span style="color:#059669; font-weight:800; font-size:12px;">Verified Ready</span>' +
          '</div>' +

          '<!-- TASTEFUL BLURRED LOCKED FEATURE PREVIEW -->' +
          '<div class="autosite-claim-locked-preview">' +
            '<div class="autosite-claim-locked-bg">' +
              '<div>[DNS Zone Records] A 76.76.21.21 • CNAME edge.autosite.net</div>' +
              '<div>[CMS Editor] Live drag-and-drop headline, service & photo studio</div>' +
              '<div>[SSL Certificate] Automated 256-bit Let\'s Encrypt Edge TLS</div>' +
              '<div>[Source Code] Complete clean HTML5, CSS & JS export archive</div>' +
            '</div>' +
            '<div class="autosite-claim-locked-overlay-box">' +
              '<div class="autosite-claim-locked-chip">🔒 Locked Features Preview</div>' +
              '<div class="autosite-claim-locked-sub">One-time claim unlocks full editor & custom domain routing</div>' +
            '</div>' +
          '</div>' +

          '<!-- UNLOCKED BENEFITS -->' +
          '<div class="autosite-claim-benefits">' +
            '<div class="autosite-claim-benefits-title">Included With Your Claim:</div>' +
            '<div class="autosite-claim-benefit-row"><span class="autosite-claim-check-icon">✓</span><span>Full commercial ownership and transfer of your website design under platform terms</span></div>' +
            '<div class="autosite-claim-benefit-row"><span class="autosite-claim-check-icon">✓</span><span>Private client dashboard to edit text, photos, services, hours, and business info</span></div>' +
            '<div class="autosite-claim-benefit-row"><span class="autosite-claim-check-icon">✓</span><span>Connect your custom domain (e.g. yourbusiness.com) with automated SSL</span></div>' +
            '<div class="autosite-claim-benefit-row"><span class="autosite-claim-check-icon">✓</span><span>High-speed global edge deployment publishing and instant live updates</span></div>' +
            '<div class="autosite-claim-benefit-row"><span class="autosite-claim-check-icon">✓</span><span>Direct customer inquiry notifications routed straight to your email</span></div>' +
            '<div class="autosite-claim-benefit-row"><span class="autosite-claim-check-icon">✓</span><span>Export or access raw website source code files (HTML5, CSS, vanilla JS)</span></div>' +
          '</div>' +

          '<!-- FIXED PRICE DISPLAY CARD ($14.99 USD) -->' +
          '<div class="autosite-claim-offer-card" id="autosite-claim-offer-card" style="padding:16px; border-radius:14px; background:#f0fdf4; border:2px solid #bbf7d0; margin-bottom:16px;">' +
            '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">' +
              '<span style="font-size:12px; font-weight:800; color:#065f46;">Complete Website Unlock</span>' +
              '<span style="padding:2px 8px; border-radius:9999px; font-size:10px; font-weight:800; background:#d1fae5; color:#065f46;">Fixed Price</span>' +
            '</div>' +
            '<div style="display:flex; align-items:baseline; gap:8px; margin-bottom:6px;">' +
              '<span style="font-size:28px; font-weight:900; color:#0f172a;">$14.99</span>' +
              '<span style="font-size:12px; font-weight:700; color:#475569;">USD One-Time Payment</span>' +
            '</div>' +
            '<div style="font-size:11px; color:#475569; line-height:1.5;">Unlocks full commercial ownership, private editor dashboard, custom domain connection, and complete source code export. No recurring fees.</div>' +
          '</div>' +

          '<!-- CUSTOMER CONTACT FIELDS -->' +
          '<div class="autosite-claim-fields">' +
            '<div class="autosite-claim-field">' +
              '<label for="autosite-claim-name">Your Full Name *</label>' +
              '<input type="text" id="autosite-claim-name" placeholder="e.g. Sarah Vance" required />' +
            '</div>' +
            '<div class="autosite-claim-field">' +
              '<label for="autosite-claim-email">Your Work Email Address *</label>' +
              '<input type="email" id="autosite-claim-email" placeholder="e.g. sarah@mybusiness.com" required />' +
            '</div>' +
          '</div>' +

          '<!-- INLINE ERROR MESSAGE BOX -->' +
          '<div id="autosite-claim-error-box" class="autosite-claim-error-box" style="display:none;"></div>' +

          '<!-- DISCLOSURES -->' +
          '<div class="autosite-claim-disclosure">' +
            '<button type="button" id="autosite-claim-disclosure-toggle" class="autosite-claim-disclosure-toggle">' +
              '<span>Transparent Platform Terms</span>' +
              '<svg id="autosite-disclosure-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transition: transform 0.2s;"><polyline points="6 9 12 15 18 9"></polyline></svg>' +
            '</button>' +
            '<div id="autosite-claim-disclosure-body" class="autosite-claim-disclosure-body">' +
              'One payment unlocks permanent website design ownership and downloadable source files. Optional high-speed cloud edge hosting & maintenance is available for $39/mo or $79/mo (cancel anytime). Custom domains can be connected for free with your own registrar, or purchased at standard annual rates (~$15/year).' +
            '</div>' +
          '</div>' +

          '<!-- ACTIONS -->' +
          '<div class="autosite-claim-actions" id="autosite-claim-actions-box">' +
            '<button type="button" id="autosite-claim-submit-btn" class="autosite-claim-cta-btn">Claim & Unlock Website</button>' +
            '<button type="button" id="autosite-claim-cancel-btn" class="autosite-claim-secondary-btn">Continue Viewing Preview</button>' +
          '</div>' +
        '</div>';

      document.body.appendChild(drawer);

      // 4. Interaction Handlers
      var amountInput = document.getElementById('autosite-claim-amount-input');
      var valMsg = document.getElementById('autosite-claim-val-msg');
      var offerCard = document.getElementById('autosite-claim-offer-card');
      var pills = drawer.querySelectorAll('.autosite-claim-pill');
      var closeBtn = document.getElementById('autosite-claim-close-btn');
      var cancelBtn = document.getElementById('autosite-claim-cancel-btn');
      var submitBtn = document.getElementById('autosite-claim-submit-btn');
      var nameInput = document.getElementById('autosite-claim-name');
      var emailInput = document.getElementById('autosite-claim-email');
      var errorBox = document.getElementById('autosite-claim-error-box');

      function showError(msg) {
        if (errorBox) {
          errorBox.textContent = msg;
          errorBox.style.display = 'block';
          errorBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }

      function clearError() {
        if (errorBox) {
          errorBox.textContent = '';
          errorBox.style.display = 'none';
        }
      }

      function openDrawer() {
        drawer.classList.add('open');
        overlay.classList.add('open');
        floatingBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
        clearError();
        setTimeout(function () {
          if (amountInput) amountInput.focus();
        }, 150);
      }

      function closeDrawer() {
        drawer.classList.remove('open');
        overlay.classList.remove('open');
        floatingBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        clearError();
      }

      floatingBtn.addEventListener('click', openDrawer);
      closeBtn.addEventListener('click', closeDrawer);

      var disclosureToggle = document.getElementById('autosite-claim-disclosure-toggle');
      var disclosureBody = document.getElementById('autosite-claim-disclosure-body');
      var disclosureChevron = document.getElementById('autosite-disclosure-chevron');
      if (disclosureToggle && disclosureBody) {
        disclosureToggle.addEventListener('click', function() {
          var isHidden = disclosureBody.style.display === 'none' || disclosureBody.style.display === '';
          disclosureBody.style.display = isHidden ? 'block' : 'none';
          if (disclosureChevron) {
            disclosureChevron.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
          }
        });
      }
      overlay.addEventListener('click', closeDrawer);
      cancelBtn.addEventListener('click', closeDrawer);

      // ESC key listener & accessibility trap
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && drawer.classList.contains('open')) {
          closeDrawer();
        }
      });

      // Submit Checkout Handler (Fixed $14.99 USD price)
      submitBtn.addEventListener('click', function () {
        clearError();

        var name = nameInput.value.trim();
        var email = emailInput.value.trim();

        if (!name || name.length < 2) {
          showError('Please enter your full name (at least 2 characters).');
          nameInput.focus();
          return;
        }

        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
          showError('Please enter a valid work email address.');
          emailInput.focus();
          return;
        }

        var offerCents = 1499; // Fixed $14.99 USD unlock price

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="autosite-claim-spinner"></span> Securing Your Website Claim...';

        fetch('/api/claim/' + encodeURIComponent(projectId) + '/initiate-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerName: name,
            customerEmail: email,
            offerAmountCents: offerCents
          })
        })
        .then(function (res) {
          return res.json().then(function (data) {
            return { ok: res.ok, status: res.status, data: data };
          });
        })
        .then(function (result) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Claim & Unlock Website';

           if (!result.ok) {
            if (result.status === 409 || (result.data && result.data.status === 'already_claimed')) {
              var contentBox = drawer.querySelector('.autosite-claim-drawer-content');
              contentBox.innerHTML = 
                '<div class="autosite-claim-already-claimed-box">' +
                  '<div style="font-size:36px;">🔒</div>' +
                  '<h3 style="font-size:18px; font-weight:800; color:#0f172a; margin:0;">Website Already Claimed</h3>' +
                  '<p style="font-size:13px; color:#475569; margin:0;">' + (result.data.message || 'This website has already been claimed by another purchaser.') + '</p>' +
                  '<button type="button" class="autosite-claim-cta-btn" onclick="document.getElementById(\'autosite-claim-drawer\').classList.remove(\'open\'); document.getElementById(\'autosite-claim-overlay\').classList.remove(\'open\');">Close & View Site</button>' +
                '</div>';
              return;
            }

            showError(result.data.message || result.data.error || 'Failed to initiate claim.');
            return;
          }

          // Render Payment Pending State (Explicitly NOT claimed yet, encouraging payment)
          var contentBox = drawer.querySelector('.autosite-claim-drawer-content');
          var invoiceNumber = result.data.order ? result.data.order.invoice_number : (result.data.orderId || 'CLM-' + Date.now().toString().slice(-6));
          var priceFormatted = '$14.99 USD';

          contentBox.innerHTML = 
            '<div class="autosite-claim-pending-payment-box">' +
              '<div style="width:52px; height:52px; margin:0 auto; border-radius:50%; background:#fff7ed; border:2px solid #fdba74; display:flex; align-items:center; justify-content:center; font-size:26px; box-shadow:0 2px 8px rgba(249,115,22,0.2);">💳</div>' +
              '<div>' +
                '<h3 style="font-size:20px; font-weight:900; color:#0f172a; margin:0 0 6px 0; letter-spacing:-0.02em;">Almost Yours! Complete Your Activation</h3>' +
                '<p style="font-size:12.5px; color:#047857; margin:0; font-weight:700; line-height:1.5;">✨ Your website preview is ready! Complete your one-time $14.99 activation to transfer full commercial ownership to your business.</p>' +
              '</div>' +

              '<!-- Reservation Status Card -->' +
              '<div style="background:#fff7ed; border-radius:14px; padding:14px; text-align:left; font-size:12px; line-height:1.7; border:1px solid #fed7aa;">' +
                '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; padding-bottom:6px; border-bottom:1px solid #ffedd5;">' +
                  '<span style="color:#065f46; font-weight:700;">Activation Status:</span>' +
                  '<span style="font-weight:900; color:#047857; background:#d1fae5; border:1px solid #6ee7b7; padding:2px 8px; border-radius:9999px; font-size:10px; letter-spacing:0.02em;">🌟 READY TO ACTIVATE ($14.99 USD)</span>' +
                '</div>' +
                '<div><strong style="color:#1e293b;">Website:</strong> ' + (claimData.businessName || 'This Website') + '</div>' +
                '<div><strong style="color:#1e293b;">Reserved For:</strong> ' + name + ' (' + email + ')</div>' +
                '<div><strong style="color:#1e293b;">Total Amount Due:</strong> <span style="font-weight:900; color:#0f172a; font-size:14px;">$14.99 USD</span> <span style="color:#64748b; font-size:10.5px;">(one-time)</span></div>' +
                '<div><strong style="color:#1e293b;">Order Ref:</strong> #' + invoiceNumber + '</div>' +
              '</div>' +

              '<!-- Encouragement & Value Unlocks -->' +
              '<div style="background:#f8fafc; border-radius:14px; padding:12px 14px; text-align:left; font-size:11.5px; border:1px solid #e2e8f0; line-height:1.6;">' +
                '<div style="font-weight:800; color:#0f172a; margin-bottom:6px; display:flex; align-items:center; gap:5px;">' +
                  '<span style="color:#ea580c;">⚡</span> Complete payment now to immediately unlock:' +
                '</div>' +
                '<div style="color:#334155;">' +
                  '<div>✓ <strong>Instant Ownership Transfer:</strong> Commercial rights reserved exclusively for you.</div>' +
                  '<div>✓ <strong>Live Dashboard Keys:</strong> Login credentials sent to <strong>' + email + '</strong> immediately upon payment.</div>' +
                  '<div>✓ <strong>Custom Domain & DNS:</strong> Connect your domain with automated SSL encryption.</div>' +
                  '<div>✓ <strong>Full Code Download:</strong> Download HTML5, CSS3, and JavaScript source bundles.</div>' +
                  '<div>✓ <strong>Exclusive Reservation:</strong> This design is reserved just for you.</div>' +
                '</div>' +
              '</div>' +

              '<!-- Clear Warning Note -->' +
              '<p style="font-size:11px; color:#64748b; margin:0; line-height:1.4;">' +
                '💡 Note: Your management dashboard keys and source code files will be instantly accessible as soon as activation is complete.' +
              '</p>' +

              '<!-- Primary High-Conversion Payment CTA -->' +
              (result.data.checkoutUrl ? 
                '<div>' +
                  '<a href="' + result.data.checkoutUrl + '" target="_blank" rel="noopener noreferrer" style="display:flex; align-items:center; justify-content:center; gap:8px; box-sizing:border-box; width:100%; background:#10b981; color:#ffffff; font-weight:900; font-size:15px; padding:15px 20px; border-radius:12px; text-decoration:none; text-align:center; box-shadow:0 4px 14px rgba(16,185,129,0.4); transition:transform 0.15s, background 0.15s; letter-spacing:-0.01em;">' +
                    '<span>Complete $14.99 Activation & Claim Website →</span>' +
                  '</a>' +
                  '<div style="margin-top:6px; font-size:10.5px; color:#64748b; font-weight:600; display:flex; align-items:center; justify-content:center; gap:6px;">' +
                    '<span>🔒 256-Bit Encrypted Checkout via Whop</span>' +
                    '<span>•</span>' +
                    '<span>⚡ Instant Activation</span>' +
                  '</div>' +
                '</div>' : '') +
              '<!-- Subtle Dismiss Option -->' +
              '<button type="button" class="autosite-claim-secondary-btn" style="margin-top:2px; color:#64748b; font-size:11px; text-decoration:underline; cursor:pointer; background:none; border:none;" onclick="document.getElementById(\'autosite-claim-drawer\').classList.remove(\'open\'); document.getElementById(\'autosite-claim-overlay\').classList.remove(\'open\');">Return to Preview</button>' +
            '</div>';

        })
        .catch(function (err) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Claim & Unlock Website';
          showError('Network Error: ' + (err.message || 'Unable to connect to claim service.'));
        });
      });
    }
  })();
});
