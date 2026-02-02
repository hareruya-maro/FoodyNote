import { useTranslation } from 'react-i18next';
import { Modal, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { X, Check } from 'lucide-react-native';
import { useState } from 'react';

interface AnalysisContextModalProps {
    visible: boolean;
    onClose: () => void;
    onAnalyze: (selectedFactors: string[]) => void;
}

export function AnalysisContextModal({ visible, onClose, onAnalyze }: AnalysisContextModalProps) {
    const { t } = useTranslation();
    const [selectedFactors, setSelectedFactors] = useState<string[]>([]);

    const factors = ["stress", "sleep", "fast_eating", "party", "medication"];

    const toggleFactor = (factor: string) => {
        if (selectedFactors.includes(factor)) {
            setSelectedFactors(prev => prev.filter(f => f !== factor));
        } else {
            setSelectedFactors(prev => [...prev, factor]);
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-end bg-black/50">
                <View className="bg-white rounded-t-3xl p-6 h-[60%]">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-xl font-bold text-gray-900">{t('context.modalTitle')}</Text>
                        <TouchableOpacity onPress={onClose} className="p-2 bg-gray-100 rounded-full">
                            <X size={20} color="#666" />
                        </TouchableOpacity>
                    </View>

                    <Text className="text-gray-500 mb-6">{t('context.modalDescription')}</Text>

                    <ScrollView className="flex-1">
                        <View className="gap-3">
                            {factors.map(factor => (
                                <TouchableOpacity
                                    key={factor}
                                    onPress={() => toggleFactor(factor)}
                                    className={`p-4 rounded-xl border flex-row items-center ${selectedFactors.includes(factor) ? 'bg-teal-50 border-teal-500' : 'bg-white border-gray-200'}`}
                                >
                                    <View className={`w-6 h-6 rounded-full border mr-3 items-center justify-center ${selectedFactors.includes(factor) ? 'border-teal-500 bg-teal-500' : 'border-gray-300'}`}>
                                        {selectedFactors.includes(factor) && <Check size={14} color="white" />}
                                    </View>
                                    <Text className={`text-base ${selectedFactors.includes(factor) ? 'text-teal-900 font-bold' : 'text-gray-700'}`}>
                                        {t(`context.factors.${factor}`)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>

                    <View className="pt-4 border-t border-gray-100">
                        <TouchableOpacity
                            onPress={() => onAnalyze(selectedFactors)}
                            className="w-full bg-teal-600 py-4 rounded-2xl items-center shadow-sm"
                        >
                            <Text className="text-white font-bold text-lg">{t('context.analyzeBtn')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
