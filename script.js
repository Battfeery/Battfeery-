document.addEventListener('DOMContentLoaded', () => {
    const $ = (id) => document.getElementById(id);
    const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
    const write = (key, val) => localStorage.setItem(key, JSON.stringify(val));
    const getUsers = () => read('battfeery_users', {});
    const getSession = () => sessionStorage.getItem('battfeery_session');

    // Stations: each has its own 24 power banks and its own rentals.
    const LOCS = {
        library: { name: 'Library', prefix: 'LIB', busy: [2,4,8,10,12,14,17,18,20,22,23,24] },
        lrc:     { name: 'LRC (Learning Resource Center)', prefix: 'LRC', busy: [1,3,5,6,9,11,13,16,19,21] }
    };
    const getLoc = () => { const k = sessionStorage.getItem('battfeery_location'); return LOCS[k] ? k : null; };

    // Login and sign-up need a chosen station first
    if (document.body.dataset.needsLoc !== undefined) {
        const k = getLoc();
        if (!k) { window.location.replace('index.html'); return; }
        if ($('locName')) $('locName').textContent = LOCS[k].name;
    }

    // Location landing page
    const locGrid = $('locationGrid');
    if (locGrid) {
        locGrid.querySelectorAll('[data-loc]').forEach(btn => {
            const k = btn.dataset.loc;
            const taken = Object.keys(read('battfeery_rentals_' + k, {})).length;
            btn.querySelector('.loc-count').textContent = `${24 - LOCS[k].busy.length - taken} of 24 available`;
            btn.addEventListener('click', () => { sessionStorage.setItem('battfeery_location', k); window.location.href = 'login.html'; });
        });
    }

    // NOTE: demo only. Passwords are kept in the browser and are NOT secure.
    // A real launch needs a backend with hashed passwords and real payment confirmation.

    // ---------- shared helpers ----------
    function showError(msg, field) {
        const box = $('formError');
        if (!box) return;
        box.textContent = msg; box.hidden = false;
        document.querySelectorAll('input.invalid').forEach(i => i.classList.remove('invalid'));
        if (field) { field.classList.add('invalid'); field.focus(); }
    }

    document.querySelectorAll('.toggle-pass').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = $(btn.dataset.target);
            const show = input.type === 'password';
            input.type = show ? 'text' : 'password';
            btn.textContent = show ? 'Hide' : 'Show';
            btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
        });
    });

    function openDialog(overlay) {
        overlay.hidden = false;
        overlay.querySelector('button, [href]')?.focus();
        const onKey = (e) => { if (e.key === 'Escape') closeDialog(overlay); };
        overlay._onKey = onKey;
        document.addEventListener('keydown', onKey);
    }
    function closeDialog(overlay) {
        overlay.hidden = true;
        document.removeEventListener('keydown', overlay._onKey);
    }

    // ---------- terms ----------
    const termsLink = $('termsLink');
    if (termsLink) {
        const dlg = document.createElement('div');
        dlg.className = 'modal-overlay'; dlg.hidden = true;
        dlg.innerHTML = `<div class="modal-content terms-modal" role="dialog" aria-modal="true" aria-labelledby="termsTitle">
            <h2 id="termsTitle">Terms and Conditions</h2>
            <div class="terms-scroll" id="termsScroll" tabindex="0" aria-label="Terms and Conditions text">
            <ol class="terms-list">
                <li>BATTFEEry

DATA PRIVACY AGREEMENT AND TERMS OF SERVICE

Operated by CDMCD Solutions Inc.
Manila Central University (MCU)</li>
                <br><li>Introduction

This Data Privacy Agreement and Terms of Service governs the use of BattFEEry, a portable power bank rental service operated by CDMCD Solutions Inc. within the Manila Central University (MCU) campus.

By creating an account and using BattFEEry, you acknowledge that you have read and understood this agreement and agree to comply with its privacy provisions and rental policies.

This agreement is established in accordance with the Data Privacy Act of 2012 (Republic Act No. 10173) and its Implementing Rules and Regulations.</li>
                <br><li> Collection of Personal Information

To provide and manage the BattFEEry service, we may collect the following personal information:

<br>* Full Name: To identify and verify the registered customer.<br>
<br>* Contact Number: To communicate important rental updates and account notifications.<br>
<br>* MCU School Email: To verify that the customer is affiliated with Manila Central University.<br>
<br>* Student or Employee ID Number: To verify identity and maintain equipment accountability.<br>
<br>* Password: To secure access to the customer’s account. Passwords will be protected using secure password-hashing methods.<br>
<br>* Campus Classification: To identify whether the registered customer is a student, faculty member, or university employee.<br>
<br>* Rental and Transaction Records: To monitor rental duration, payments, outstanding balances, and equipment returns.<br>
<br>* RFID Monitoring Information: To monitor authorized equipment movement and determine whether a rented power bank has crossed designated MCU campus boundaries.</li><br>
                <br><li>Purpose of Data Collection and Processing

The information collected will be used exclusively for legitimate operational purposes, including:

<br>1. Creating, managing, and securing customer accounts.<br>
<br>2. Verifying MCU affiliation and customer identity.<br>
<br>3. Processing payments through supported payment channels, including InstaPay.<br>
<br>4. Recording rental transactions and calculating rental charges.<br>
<br>5. Monitoring the duration and return of rented power banks.<br>
<br>6. Enforcing equipment security and preventing unauthorized removal or misuse.<br>
<br>7. Communicating important service announcements and transaction updates.<br>
<br>8. Resolving disputes, unpaid balances, damaged equipment, and unreturned devices.<br>

BattFEEry will not use personal information for unrelated purposes without an appropriate legal basis and, where required, the customer’s consent.

4. Data Protection and Disclosure</li>
                <br><li>Data Protection and Disclosure

CDMCD Solutions Inc. is committed to protecting the confidentiality and security of customer information.

Reasonable organizational, physical, and technical safeguards will be implemented to prevent unauthorized access, disclosure, alteration, loss, or misuse of personal information.

Personal information will not be sold to third parties.

However, information may be disclosed when necessary and legally justified, including:

<br>* To authorized MCU representatives when investigating unreturned equipment, theft, or serious violations of university-related equipment policies.<br>
<br>* To payment service providers when processing and verifying transactions.<br>
<br>* To law enforcement or government authorities when required or authorized by applicable laws and lawful requests.<br>
<br>* To authorized service providers that support the operation and maintenance of BattFEEry, subject to appropriate privacy and security safeguards.<br>

Any disclosure will be limited to the information reasonably necessary for the stated purpose.
</li>
                <br><li>Data Retention and Account Deletion

Customer information will be retained only for as long as necessary to fulfill the purposes for which it was collected, comply with applicable legal obligations, and establish, exercise, or defend legal claims.

Customers may request account closure and deletion of their personal information. However, certain transaction records may be retained when necessary to resolve outstanding rental balances, equipment-related disputes, or legal obligations.

Once retention is no longer necessary or legally justified, personal information will be securely deleted, destroyed, or anonymized.
</li>
<br><li>Rental Rates and Payment Policy

By using BattFEEry, customers agree to the following rental conditions:

<br>* Standard Rental Fee: ₱30.00 for the first hour of power bank rental.<br>
<br>* Late Return Penalty: ₱10.00 for every additional 30 minutes beyond the agreed rental period.<br>
<br>* Payment Method: Payments must be completed through the supported payment channels, including InstaPay, before the power bank is released.<br>

Customers are responsible for checking their rental duration and ensuring that payment information is accurate.

Applicable charges for additional rental time must be clearly displayed in the application before the customer confirms the rental.</li>
<br><li>Equipment Security and Responsibility

Customers are responsible for the proper use, care, and timely return of rented power banks.

The following conditions apply:

<br> 1. Power banks must remain within the designated boundaries of Manila Central University.<br>
<br> 2. RFID sensors may be used to monitor equipment movement and identify unauthorized removal from the campus. <br>
<br> 3. Customers must return the power bank within their selected rental period.<br>
<br> 4. Customers are responsible for damage, loss, or unauthorized use resulting from their actions or negligence, subject to applicable law.<br>
<br> 5. Lost, stolen, or severely damaged equipment may result in replacement or repair charges based on the documented and disclosed cost of the equipment.<br>
<br> 6. Attempts to tamper with RFID sensors, rental machines, or power banks are prohibited.<br> 

<br>Customers may be held responsible for applicable charges following proper verification and an opportunity to dispute the reported incident.</li>
<br><li>Violation of Terms and Account Suspension<br>

CDMCD Solutions Inc. reserves the right to temporarily suspend or restrict an account when there is reasonable evidence of:

<br>* Unreturned or stolen power banks.<br>
<br>* Deliberate damage to rental equipment.<br>
<br>* Unauthorized removal of equipment from MCU premises.<br>
<br>* Fraudulent payment transactions.<br>
<br>* Repeated violations of rental policies.<br>

Customers will be informed of the reason for account restrictions and may contact BattFEEry to dispute the incident or resolve outstanding obligations.</li>
<br><li>Amendments to This Agreement

CDMCD Solutions Inc. reserves the right to update this agreement when necessary due to operational improvements, changes in rental policies, or applicable legal requirements.

Customers will be notified of significant changes through the BattFEEry application or their registered contact information.

Where additional consent is legally required, customers will be asked to provide it before the affected processing activity continues.</li>
<br><li>Contact Information For questions, concerns, privacy requests, or disputes regarding this agreement, customers may contact: Company: CDMCD Solutions Inc. Service: BattFEEry Portable Power Bank Rental Location: Manila Central University Data Protection Officer: [Insert DPO Name] Email Address: [Insert Official Email Address] Contact Number: [Insert Official Contact Number]
</li>


            </ol>
            <div class="agree-box">
                <label class="agree-check">
                    <input type="checkbox" id="termsAgree" disabled>
                    <span>
                        <strong>By checking the agreement box and selecting CREATE ACCOUNT, I confirm that:</strong>
                        <ul>
                            <li>I have read and understood the BattFEEry Data Privacy Agreement and Terms of Service.</li>
                            <li>I understand the personal information collected and its intended purposes.</li>
                            <li>I acknowledge the rental rates, late return penalties, and equipment security policies.</li>
                            <li>I understand my rights under the Data Privacy Act of 2012.</li>
                            <li>I agree to comply with the applicable rental conditions and operational rules.</li>
                        </ul>
                        <span class="agree-final">I voluntarily provide my consent to the processing of my personal information where consent is the applicable legal basis for processing.</span>
                    </span>
                </label>
            </div>
            </div>
            <p class="terms-hint" id="termsHint">Scroll to the end of the agreement to enable the checkbox.</p>
            <div class="modal-actions">
                <button class="close-btn" id="termsClose" type="button">Close</button>
                <button class="primary-btn" id="termsAccept" type="button" disabled>I agree</button>
            </div></div>`;
        document.body.appendChild(dlg);

        const scroller = dlg.querySelector('#termsScroll');
        const agree = dlg.querySelector('#termsAgree');
        const accept = dlg.querySelector('#termsAccept');
        const hint = dlg.querySelector('#termsHint');
        const termsBox = $('terms');
        let readAll = false, accepted = false;

        // The agreement checkbox stays disabled until the person has scrolled to the very end
        const checkRead = () => {
            if (readAll || scroller.scrollTop + scroller.clientHeight < scroller.scrollHeight - 12) return;
            readAll = true; agree.disabled = false;
            hint.textContent = 'Check the agreement box, then tap "I agree".';
        };
        scroller.addEventListener('scroll', checkRead);
        agree.addEventListener('change', () => { accept.disabled = !agree.checked; });

        const openTerms = () => {
            openDialog(dlg);
            if (!readAll) scroller.scrollTop = 0;
            scroller.focus();
            checkRead();
        };
        termsLink.addEventListener('click', (e) => { e.preventDefault(); openTerms(); });
        // The sign-up checkbox can't be ticked until the agreement was read and accepted in the dialog
        termsBox.addEventListener('click', (e) => { if (!accepted) { e.preventDefault(); openTerms(); } });

        accept.addEventListener('click', () => {
            accepted = true; termsBox.checked = true;
            if ($('formError')) $('formError').hidden = true;
            closeDialog(dlg);
        });
        dlg.querySelector('#termsClose').addEventListener('click', () => closeDialog(dlg));
        dlg.addEventListener('click', (e) => { if (e.target === dlg) closeDialog(dlg); });
    }

    // ---------- sign up ----------
    const signupForm = $('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const f = signupForm.elements;
            const name = f.fullName.value.trim();
            const email = f.schoolEmail.value.trim().toLowerCase();
            const idNo = f.idNo.value.trim();
            const contact = f.contactNo.value.replace(/[\s-]/g, '');

            if (!name) return showError('Enter your full name.', f.fullName);
            if (!/^(09|\+639)\d{9}$/.test(contact)) return showError('Enter a valid mobile number, like 09XX XXX XXXX.', f.contactNo);
            if (!/^\S+@\S+\.\S+$/.test(email)) return showError('Enter a valid email address.', f.schoolEmail);
            if (!idNo) return showError('Enter your student or employee number.', f.idNo);
            if (f.password.value.length < 6) return showError('Password must be at least 6 characters.', f.password);
            if (!f.role.value) return showError('Choose Student or Employee.');
            if (!$('terms').checked) return showError('Open the Terms and Conditions, read them to the end, and accept to continue.', $('terms'));

            const users = getUsers();
            const idTaken = Object.values(users).some(u => u.idNo.toLowerCase() === idNo.toLowerCase());
            if (users[email] || idTaken) return showError('An account with this email or ID already exists. Log in instead.', f.schoolEmail);

            users[email] = { name, email, idNo, contact, role: f.role.value, password: f.password.value };
            write('battfeery_users', users);
            sessionStorage.setItem('battfeery_session', email);
            window.location.href = 'dashboard.html';
        });
    }

    // ---------- login ----------
    const loginForm = $('loginForm');
    if (loginForm) {
        if (getSession() && getUsers()[getSession()]) window.location.replace('dashboard.html');
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = $('loginId').value.trim().toLowerCase();
            const pass = $('loginPassword').value;
            if (!id || !pass) return showError('Enter your email or ID and your password.', id ? $('loginPassword') : $('loginId'));
            const user = Object.values(getUsers()).find(u => u.email === id || u.idNo.toLowerCase() === id);
            if (!user) return showError('No account found. Check your email or ID, or create an account.', $('loginId'));
            if (user.password !== pass) return showError('Wrong password. Try again.', $('loginPassword'));
            sessionStorage.setItem('battfeery_session', user.email);
            window.location.href = 'dashboard.html';
        });
    }

    // ---------- dashboard ----------
    const book = $('bookView');
    if (book) {
        const email = getSession();
        const user = email && getUsers()[email];
        if (!user) { window.location.replace('login.html'); return; }
        $('userNameDisplay').textContent = user.name.split(' ')[0];

        // A user with an active rental stays on that station
        let locKey = getLoc();
        Object.keys(LOCS).forEach(k => { if (read('battfeery_rentals_' + k, {})[email]) locKey = k; });
        if (!locKey) { window.location.replace('index.html'); return; }
        sessionStorage.setItem('battfeery_location', locKey);
        const LOC = LOCS[locKey];
        $('locName').textContent = LOC.name;
        $('logoutBtn').addEventListener('click', () => { sessionStorage.removeItem('battfeery_session'); window.location.href = 'index.html'; });

        const RATE = 30, GRACE = 15, LATE_FEE = 10, LATE_BLOCK = 30;
        const COLORS = { blue: 'Blue', pink: 'Pink', orange: 'Orange', yellow: 'Yellow', violet: 'Violet', green: 'Green' };
        const keys = Object.keys(COLORS);
        const busy = new Set(LOC.busy);
        const banks = Array.from({ length: 24 }, (_, i) => ({ id: `${LOC.prefix}-${String(i + 1).padStart(2, '0')}`, color: keys[i % keys.length], busy: busy.has(i + 1) }));
        const RKEY = 'battfeery_rentals_' + locKey;
        const getR = () => read(RKEY, {});
        const setR = (r) => write(RKEY, r);
        const fmt = (m) => m < 60 ? `${m} min` : `${Math.floor(m / 60)} h ${m % 60} min`;
        const modal = $('qrModal');
        let color = 'any', hours = 1, pending = null, method = 'qr';

        const freeBanks = () => {
            const taken = new Set(Object.values(getR()).map(r => r.id));
            return banks.filter(b => !b.busy && !taken.has(b.id));
        };
        const pick = (c) => freeBanks().find(b => c === 'any' || b.color === c);

        function bill(r) {
            const end = r.returnedAt || Date.now();
            const elapsed = Math.floor((end - r.start) / 60000);
            const over = elapsed - r.hours * 60;
            const phase = over <= 0 ? 'active' : over <= GRACE ? 'grace' : 'late';
            const fee = over > GRACE ? Math.ceil((over - GRACE) / LATE_BLOCK) * LATE_FEE : 0;
            return { elapsed, over, phase, fee };
        }

        function renderBook() {
            const free = freeBanks();
            const count = (c) => free.filter(b => b.color === c).length;
            const opts = [...keys.map(k => ({ k, label: COLORS[k], n: count(k) })), { k: 'any', label: 'Let the machine choose', n: free.length }];
            if (color !== 'any' && !count(color)) color = 'any';
            book.innerHTML = `
              <h2 class="step-title">1. Choose a color</h2>
              <div class="color-grid">${opts.map(o => `
                <button type="button" class="color-opt ${o.k === color ? 'selected' : ''}" data-color="${o.k}" ${o.n ? '' : 'disabled'} aria-pressed="${o.k === color}">
                  ${o.k === 'any' ? '<span class="img-stack"><img class="pb-img" src="pb-blue.png" alt=""><img class="pb-img" src="pb-orange.png" alt=""><img class="pb-img" src="pb-green.png" alt=""></span>' : `<img class="pb-img" src="pb-${o.k}.png" alt="">`}<strong>${o.label}</strong><small>${o.n ? o.n + ' available' : 'None left'}</small>
                </button>`).join('')}</div>
              <h2 class="step-title">2. Choose how many hours</h2>
              <div class="hours-row">
                <button type="button" class="step-btn" id="hMinus" aria-label="One hour less">−</button>
                <span class="hours-val" aria-live="polite">${hours} ${hours === 1 ? 'hour' : 'hours'}</span>
                <button type="button" class="step-btn" id="hPlus" aria-label="One hour more">+</button>
                <span class="rate-note">₱${RATE} per hour</span>
              </div>
              <h2 class="step-title">3. Pay</h2>
              <button type="button" class="primary-btn pay-btn" id="payBtn" ${free.length ? '' : 'disabled'}>${free.length ? `Proceed to payment · ₱${hours * RATE}` : 'No power banks available'}</button>
              <p class="fine-print">${GRACE}-minute grace period after your time ends. After that, ₱${LATE_FEE} for every ${LATE_BLOCK} minutes until you return it.</p>`;
            book.querySelectorAll('.color-opt').forEach(b => b.addEventListener('click', () => { color = b.dataset.color; renderBook(); }));
            $('hMinus').addEventListener('click', () => { hours = Math.max(1, hours - 1); renderBook(); });
            $('hPlus').addEventListener('click', () => { hours = Math.min(8, hours + 1); renderBook(); });
            $('payBtn').addEventListener('click', () => {
                pending = { type: 'rent', amount: hours * RATE };
                openPay('Scan to pay', `${color === 'any' ? 'Any color' : COLORS[color]} · ${hours} ${hours === 1 ? 'hour' : 'hours'}`, pending.amount, 'Not paid yet? Cancel to go back and try again.');
            });
        }

        function renderActive(r) {
            const b = bill(r);
            const view = $('activeView');
            let status, cls = '';
            if (b.phase === 'active') status = `<p class="big-time">${fmt(r.hours * 60 - b.elapsed)} left</p><p>Return it to any BattFEEry machine before time runs out.</p>`;
            else if (b.phase === 'grace') { cls = 'warn'; status = `<p class="big-time">Grace period: ${fmt(GRACE - b.over)} left</p><p>Return it now to avoid extra charges.</p>`; }
            else { cls = 'late'; status = `<p class="big-time">Overdue fee: ₱${b.fee}</p><p>₱${LATE_FEE} is added every ${LATE_BLOCK} minutes. Return it now.</p>`; }
            if (r.returnedAt) { cls = ''; status = `<p class="big-time">Returned</p><p>${b.fee > 0 ? `Balance to pay: ₱${b.fee}` : 'No balance. All payments are settled.'}</p>`; }
            view.innerHTML = `<div class="rental-card ${cls}">
                <img class="rental-img" src="pb-${r.color}.png" alt="${COLORS[r.color]} power bank">
                <p class="rental-title">${r.id} · ${COLORS[r.color]} · ${r.hours} ${r.hours === 1 ? 'hour' : 'hours'} paid${r.method ? ' by ' + (r.method === 'cash' ? 'cash' : 'QR') : ''}</p>
                ${r.fresh ? `<p class="release">Payment received. Take your power bank from slot ${r.id}.</p>` : ''}
                ${status}
                <button type="button" class="primary-btn" id="returnBtn">${r.returnedAt && b.fee > 0 ? `Pay remaining balance · ₱${b.fee}` : 'I returned it'}</button></div>`;
            $('returnBtn').addEventListener('click', () => {
                const all = getR(); const cur = all[email]; if (!cur) return;
                if (!cur.returnedAt) cur.returnedAt = Date.now();
                const fee = bill(cur).fee;
                if (fee > 0) {
                    setR(all);
                    pending = { type: 'balance', amount: fee };
                    openPay('Pay remaining balance', `${cur.id} · returned late`, fee, 'Your rental ends once this is paid.');
                } else { delete all[email]; setR(all); finish('Power bank returned. All payments are settled. Thanks!'); }
            });
        }

        function renderStatus() {
            const rentals = getR();
            const taken = new Map(Object.values(rentals).map(r => [r.id, r]));
            const stateOf = (b) => taken.has(b.id) ? (rentals[email]?.id === b.id ? 'mine' : 'used') : (b.busy ? 'used' : 'free');
            const free = banks.filter(b => stateOf(b) === 'free').length;
            $('statusView').innerHTML = `
              <div class="status-head"><h2 class="step-title">Power bank availability</h2>
                <p class="counts"><span class="legend l-free"></span>${free} available <span class="legend l-used"></span>${banks.length - free} in use</p></div>
              <div class="powerbank-grid">${banks.map(b => {
                const s = stateOf(b);
                return `<div class="pb-card ${s === 'free' ? 'pb-available' : s === 'mine' ? 'pb-mine' : 'pb-unavailable'}">
                  <img class="pb-thumb" src="pb-${b.color}.png" alt=""><h3>${b.id}</h3><span class="color-tag"><span class="dot sw-${b.color}"></span>${COLORS[b.color]}</span>
                  <span class="status">${s === 'free' ? 'Available' : s === 'mine' ? 'Yours' : 'In use'}</span></div>`;
              }).join('')}</div>`;
        }

        function render() {
            renderStatus();
            const r = getR()[email];
            book.hidden = !!r; $('activeView').hidden = !r; $('changeLoc').hidden = !!r;
            if (r) { $('doneMsg').hidden = true; renderActive(r); } else renderBook();
        }
        function finish(msg) { render(); $('doneMsg').textContent = msg; $('doneMsg').hidden = false; }
        function openPay(title, sub, amount, note) {
            $('modalTitle').textContent = title; $('modalSubtitle').textContent = sub;
            $('modalAmount').textContent = `Amount: ₱${amount}`; $('modalNote').textContent = note;
            setMethod('qr');
            openDialog(modal);
        }

        function setMethod(m) {
            method = m;
            document.querySelectorAll('.pay-tab').forEach(t => { const on = t.dataset.method === m; t.classList.toggle('active', on); t.setAttribute('aria-pressed', on); });
            $('qrPanel').hidden = m !== 'qr'; $('cashPanel').hidden = m !== 'cash';
            $('confirmPayBtn').textContent = m === 'cash' ? 'Cash inserted' : "I've paid";
        }
        document.querySelectorAll('.pay-tab').forEach(t => t.addEventListener('click', () => setMethod(t.dataset.method)));

        $('closeModalBtn').addEventListener('click', () => closeDialog(modal));
        modal.addEventListener('click', (e) => { if (e.target === modal) closeDialog(modal); });
        $('confirmPayBtn').addEventListener('click', () => {
            closeDialog(modal);
            if (!pending) return;
            if (pending.type === 'rent') {
                const bank = pick(color);
                if (!bank) { render(); return; }
                const all = getR(); all[email] = { id: bank.id, color: bank.color, hours, start: Date.now(), fresh: true, method }; setR(all);
                render();
                const cur = getR(); cur[email].fresh = false; setR(cur);
            } else {
                const all = getR(); delete all[email]; setR(all);
                finish('Balance paid. All payments are settled. Thanks!');
            }
            pending = null;
        });

        render();
        setInterval(() => { const r = getR()[email]; if (modal.hidden) { renderStatus(); if (r) renderActive(r); } }, 15000);
    }
});
