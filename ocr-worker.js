const MODEL = 'onnx-community/latex_finetuned-ONNX';
const CDN = 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1/+esm';
let recognizerPromise = null; let api = null;
function post(type, payload = {}) { self.postMessage({ type, ...payload }); }
async function ensureRecognizer() {
  if (recognizerPromise) return recognizerPromise;
  recognizerPromise = (async () => {
    post('progress', { progress: 0.03, detail: 'OCRエンジンを準備中' });
    api ??= await import(CDN); api.env.useBrowserCache = true; api.env.allowRemoteModels = true;
    const options = { dtype: 'q4f16', device: 'gpu' in navigator ? 'webgpu' : 'wasm', progress_callback(info) { let p = 0.06; if (typeof info?.progress === 'number') p = 0.06 + Math.max(0, Math.min(1, info.progress / 100)) * 0.72; post('progress', { progress: p, detail: String(info?.file || info?.name || info?.status || '高精度モデルを端末に保存中') }); } };
    try { return await api.pipeline('image-to-text', MODEL, options); }
    catch { post('progress', { progress: 0.12, detail: '互換モードでOCRを準備中' }); return await api.pipeline('image-to-text', MODEL, { progress_callback: options.progress_callback }); }
  })();
  try { return await recognizerPromise; } catch (error) { recognizerPromise = null; throw error; }
}
self.onmessage = async event => {
  const message = event.data || {};
  if (message.type === 'WARMUP') { try { await ensureRecognizer(); post('ready'); } catch (error) { post('error', { message: error?.message || String(error) }); } return; }
  if (message.type !== 'RECOGNIZE') return;
  try {
    const recognizer = await ensureRecognizer(); post('progress', { progress: 0.82, detail: '手書きの構造を読み取り中' });
    const url = URL.createObjectURL(message.blob);
    try { const output = await recognizer(url, { max_new_tokens: 196, num_beams: 3 }); const text = output?.[0]?.generated_text ?? output?.[0]?.text ?? ''; post('progress', { progress: 0.96, detail: '式の候補を検証中' }); post('result', { id: message.id, text: String(text).trim() }); }
    finally { URL.revokeObjectURL(url); }
  } catch (error) { post('error', { id: message.id, message: error?.message || String(error) }); }
};
