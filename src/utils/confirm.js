import create from 'zustand';

export const useConfirmDialogStore = create((set) => ({
    message: '',
    onSubmit: undefined,
    onCancel: () => set({ onSubmit: undefined })
}));

export const confirm = (message, onSubmit) => {
    useConfirmDialogStore.setState({
        message,
        onSubmit
    });
};
