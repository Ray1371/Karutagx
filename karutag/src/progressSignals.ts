// type Listener = (value: number) => void;

// class ProgressSignal {
//   private listeners: Listener[] = [];
//   private value = 0;

//   set(value: number) {
//     this.value = value;
//     this.listeners.forEach(listener => listener(value));
//   }

//   subscribe(listener: Listener) {
//     this.listeners.push(listener);
//     // Return an unsubscribe function
//     return () => {
//       this.listeners = this.listeners.filter(l => l !== listener);
//     };
//   }
// }

// export const uploadProgress = new ProgressSignal();

// progressSignals.ts
// Simple callback bundle used by upload/import routines to report progress back to UI.

export type progressSignal = {
  updateRowCount?: (count: number) => void;
  updateCompletedRows?: (count: number) => void;

  // Used to notify that parsing/upload finished successfully (or generally became "valid")
  updateValid?: (valid: boolean) => void;
};
