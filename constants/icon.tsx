import { IconSymbol } from "@/components/ui/icon-symbol";

export const icon = {
	index: (props: any) => <IconSymbol name='house.fill' size={24} {...props} />,
	library: (props: any) => <IconSymbol name='book.fill' size={24} {...props} />,
	stats: (props: any) => <IconSymbol name='chart.bar' size={24} {...props} />,
	pomodoro: (props: any) => (
		<IconSymbol name='clock.fill' size={24} {...props} />
	),
};
