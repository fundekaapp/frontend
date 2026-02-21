import { Canvas, Circle, Path, RoundedRect } from "@shopify/react-native-skia";

export default function MascotBody() {
	return (
		<Canvas style={{ width: 500, height: 500 }}>
			{/* body */}
			<Path
				path='M40 182.857C40 103.959 107.157 40 190 40C272.843 40 340 103.959 340 182.857L340 282.857C340 314.416 313.137 340 280 340C270.178 340 260.907 337.752 252.724 333.768C248.554 331.737 244.394 329.512 240.216 327.277C225.513 319.411 210.592 311.429 194.27 311.429H185.73C169.408 311.429 154.487 319.411 139.784 327.277C135.606 329.512 131.446 331.737 127.276 333.768C119.093 337.752 109.822 340 100 340C66.8629 340 40 314.416 40 282.857L40 182.857Z'
				color='#9584ff'
			/>

			{/* eyes */}
			<RoundedRect x={210} y={130} width={80} height={80} r={40} color='#fff' />
			<RoundedRect x={95} y={130} width={80} height={80} r={40} color='#fff' />
			<Circle cx={135} cy={175} r={20} color={"#000"} />
			<Circle cx={250} cy={175} r={20} color={"#000"} />

			{/* top eye  */}
			<RoundedRect
				x={60}
				y={100}
				width={265}
				height={70}
				r={40}
				color='#9584ff'
			/>

			{/* mouth straight line path */}
			<RoundedRect r={5} color='#000' width={100} height={5} x={145} y={250} />
		</Canvas>
	);
}
