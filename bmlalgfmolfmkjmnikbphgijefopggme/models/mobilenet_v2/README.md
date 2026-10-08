Updating the NSFW model (MobileNetV2)

This folder contains the TensorFlow.js GraphModel used by the NSFW blur feature. The content script loads the model at runtime from this path.

Where this is referenced

```498:500:app/content/NSFWBlur.js
  const modelUrl = chrome.runtime.getURL('models/mobilenet_v2/');
  nsfwModelPromise = nsfwjs
    .load(modelUrl, { size: 224 })
```

What files belong here

- model.json (GraphModel topology and weight manifest)
- One or more weight shard files named like `group1-shard1ofN.bin`, `group1-shard2ofN.bin`, etc.

When you should update

- When a newer model is available (e.g., quality improvements, bug/security fixes)
- When switching model architectures (e.g., from MobileNetV2 224×224 to EfficientNet or other variants)

Step-by-step: Update to a new model

1. Pick or export a TFJS GraphModel

- Option A: Use a prebuilt NSFWJS TFJS GraphModel.
  - See the NSFWJS project: [NSFWJS repository](https://github.com/infinitered/nsfwjs)
- Option B: Convert a SavedModel/Checkpoint to TFJS GraphModel via tensorflowjs_converter.

2. Create a versioned model folder

- To keep history and enable rollback, create a new folder under `app/models/` rather than replacing in-place, for example:
  - `app/models/mobilenet_v2-2026-01-22/`
- Copy the new `model.json` and all shard `.bin` files into that folder.

3. Point the code to the new folder

- Update the base URL in `app/content/NSFWBlur.js` to match your new directory name.
- If the new model requires a different input size, update the `size` option accordingly (e.g., 224 for MobileNetV2, 299 for InceptionV3).

4. Update Gruntfile.js

- Update the model path in Gruntfile.js:
  ```javascript
  {expand: true, cwd: 'app/models/', src: ['mobilenet_v2/**'], dest: 'edge_v/models/'},
  {expand: true, cwd: 'app/models/', src: ['mobilenet_v2/**'], dest: 'edge_v_debug/models/'},
  ```

5. Update manifest files

- Update both `app/manifest/manifest.json` and `app/manifest/manifest_dev.json`:
  ```json
  "resources": ["fonts/*", "*.svg", "models/mobilenet_v2/*"]
  ```

6. Build and verify

```bash
grunt
```

Notes and best practices

- Maintain a versioned directory name per model update for traceability.
- Ensure the final folder contains `model.json` at its root.
- Keep `nsfwjs.min.js` as-is; only the model folder typically changes.
- MobileNetV2 is typically smaller and faster than InceptionV3, making it ideal for performance-sensitive applications.
