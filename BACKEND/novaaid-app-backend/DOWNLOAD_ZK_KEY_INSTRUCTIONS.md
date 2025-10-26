# Download ZK Service Account Key - Step by Step

## Quick Instructions

### 1. Go to Firebase Console
👉 https://console.firebase.google.com/project/nova-aid-blockchain-zk-data/settings/serviceaccounts/adminsdk

### 2. Generate & Download Key

1. You should see the **Service accounts** tab
2. Make sure you're in the **nova-aid-blockchain-zk-data** project (check top left)
3. Click the button **"Generate new private key"**
4. A dialog will appear warning about keeping it secure - click **"Generate key"**
5. A JSON file will download automatically

### 3. Rename & Move the File

The downloaded file will have a long name like:
```
nova-aid-blockchain-zk-data-firebase-adminsdk-xxxxx-1234567890.json
```

**Rename it to:**
```
zkServiceAccountKey.json
```

**Move it to:**
```
d:\Refugee Lifeline\NovaAid\BACKEND\novaaid-app-backend\zkServiceAccountKey.json
```

### 4. Verify File Contents

Open `zkServiceAccountKey.json` and verify it contains:
```json
{
  "type": "service_account",
  "project_id": "nova-aid-blockchain-zk-data",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...",
  "client_email": "firebase-adminsdk-xxxxx@nova-aid-blockchain-zk-data.iam.gserviceaccount.com",
  ...
}
```

✅ The important part is `"project_id": "nova-aid-blockchain-zk-data"`

### 5. Restart Backend

Stop the backend (if running) with `Ctrl+C` and restart:

```bash
cd "d:\Refugee Lifeline\NovaAid\BACKEND\novaaid-app-backend"
npm run dev
```

### 6. Check Logs

You should now see **both** databases initialized:

```
Firebase Admin initialized successfully (Auth DB)
Firebase Admin initialized successfully (ZK DB)
NovaAid Backend Server running on port 3001
```

✅ If you see both messages, setup is complete!

---

## Alternative: Using Environment Variable

If you prefer to store the path elsewhere, create a `.env` file:

```bash
FIREBASE_ZK_SERVICE_ACCOUNT_PATH=/path/to/zkServiceAccountKey.json
```

---

## Troubleshooting

### Can't find the project

Make sure you're logged in with the Google account that has access to `nova-aid-blockchain-zk-data`.

If you don't see the project:
1. Ask the project owner to add you as an Editor
2. Or use the Firebase credentials you provided earlier

### Permission Denied Error

Your service account needs **Cloud Datastore User** or **Firebase Admin** role.

To fix:
1. Go to https://console.cloud.google.com/iam-admin/iam?project=nova-aid-blockchain-zk-data
2. Find the service account email (looks like `firebase-adminsdk-xxxxx@...`)
3. Click Edit (pencil icon)
4. Add role: **Cloud Datastore User** or **Firebase Admin SDK Administrator Service Agent**

### File Downloaded but Not Working

Verify:
1. ✅ File name is exactly `zkServiceAccountKey.json`
2. ✅ File is in the correct directory: `BACKEND/novaaid-app-backend/`
3. ✅ File is valid JSON (open in text editor)
4. ✅ `project_id` field says `"nova-aid-blockchain-zk-data"`

---

## Security Reminder 🔒

- ⚠️ **NEVER** commit this file to Git
- ⚠️ **NEVER** share this file publicly
- ⚠️ It's already added to `.gitignore`
- ⚠️ Treat it like a password - it gives full access to the database

---

## What's Next?

Once the ZK database is connected:

1. ✅ All commitments will be stored in `nova-aid-blockchain-zk-data`
2. ✅ All Merkle roots will be saved there
3. ✅ All verifications will be recorded there
4. ✅ The Clerk auth database (`nova-aid-43305`) remains separate

This separation ensures clean data architecture for future NGO verification features!
