import { Button } from "./ui/Button";

interface ImportResult {
  imported: number;
  skipped: number;
  errors: Array<{
    row: number;
    reason: string;
  }>;
}

interface ImportResultModalProps {
  result: ImportResult | null;
  onClose: () => void;
}

export default function ImportResultModal({ result, onClose }: ImportResultModalProps) {
  if (!result) return null;

  const totalErrors = result.errors.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Результати імпорту</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-success/10 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-success">{result.imported}</div>
            <div className="text-xs text-success/80 font-medium uppercase tracking-wider">Успішно</div>
          </div>
          <div className="bg-warning/10 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-warning">{result.skipped}</div>
            <div className="text-xs text-warning/80 font-medium uppercase tracking-wider">Пропущено</div>
          </div>
          <div className="bg-danger/10 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-danger">{totalErrors}</div>
            <div className="text-xs text-danger/80 font-medium uppercase tracking-wider">Помилки</div>
          </div>
        </div>

        {totalErrors > 0 && (
          <div className="space-y-2 mb-6">
            <h3 className="text-sm font-semibold text-text-muted">Деталі помилок:</h3>
            <div className="max-h-48 overflow-y-auto rounded-lg border border-border">
              <table className="w-full text-xs">
                <thead className="bg-surface sticky top-0">
                  <tr className="border-b border-border">
                    <th className="px-3 py-2 text-left font-bold">Рядок</th>
                    <th className="px-3 py-2 text-left font-bold">Причина</th>
                  </tr>
                </thead>
                <tbody>
                  {result.errors.map((error, idx) => (
                    <tr key={idx} className="border-b border-border last:border-0">
                      <td className="px-3 py-2 text-text-muted">#{error.row}</td>
                      <td className="px-3 py-2 text-danger">{error.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button onClick={onClose} size="md" className="px-8 font-bold">
            Зрозуміло
          </Button>
        </div>
      </div>
    </div>
  );
}
