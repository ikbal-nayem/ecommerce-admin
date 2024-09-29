import ContentLoader from "react-content-loader";

const ProductTableSkelton = (props) => {
  const { thumb = true, topSearchNSelect = true, viewBox } = props;

	return (
		<>
			<ContentLoader
				speed={2}
				backgroundColor="#f5f6f7"
				foregroundColor="#ecebeb"
				viewBox={viewBox}
			>
				{topSearchNSelect ? (
					<rect x="12" y="12" rx="4" ry="4" width="378" height="18" />
				) : null}
				{topSearchNSelect ? (
					<rect x="398" y="12" rx="4" ry="4" width="85" height="17" />
				) : null}
				{topSearchNSelect ? (
					<rect x="495" y="12" rx="4" ry="4" width="85" height="17" />
				) : null}
				<rect
					x={thumb ? "42" : "12"}
					y="65"
					rx="4"
					ry="4"
					width="60"
					height="8"
				/>
				<rect x="191" y="41" rx="4" ry="4" width="71" height="8" />
				<rect x="319" y="41" rx="4" ry="4" width="71" height="8" />
				<rect x="429" y="41" rx="4" ry="4" width="71" height="8" />
				{thumb ? (
					<rect x="12" y="59" rx="4" ry="4" width="23" height="20" />
				) : null}
				<rect x="12" y="41" rx="4" ry="4" width="71" height="8" />
				<rect x="191" y="65" rx="4" ry="4" width="71" height="8" />
				<rect x="319" y="66" rx="4" ry="4" width="71" height="8" />
				<rect x="554" y="62" rx="4" ry="4" width="7" height="15" />
				<rect x="429" y="65" rx="4" ry="4" width="71" height="8" />
				<rect x="0" y="55" rx="0" ry="0" width="592" height="1" />
				<rect x="0" y="82" rx="0" ry="0" width="592" height="1" />
				<rect
					x={thumb ? "42" : "12"}
					y="92"
					rx="4"
					ry="4"
					width="60"
					height="8"
				/>
				{thumb ? (
					<rect x="12" y="86" rx="4" ry="4" width="23" height="20" />
				) : null}
				<rect x="191" y="92" rx="4" ry="4" width="71" height="8" />
				<rect x="319" y="92" rx="4" ry="4" width="71" height="8" />
				<rect x="554" y="89" rx="4" ry="4" width="7" height="15" />
				<rect x="429" y="92" rx="4" ry="4" width="71" height="8" />
				<rect x="0" y="109" rx="0" ry="0" width="592" height="1" />
				<rect
					x={thumb ? "42" : "12"}
					y="119"
					rx="4"
					ry="4"
					width="60"
					height="8"
				/>
				{thumb ? (
					<rect x="12" y="113" rx="4" ry="4" width="23" height="20" />
				) : null}
				<rect x="416" y="210" rx="4" ry="4" width="55" height="8" />
				<rect x="319" y="119" rx="4" ry="4" width="71" height="8" />
				<rect x="554" y="116" rx="4" ry="4" width="7" height="15" />
				<rect x="429" y="119" rx="4" ry="4" width="71" height="8" />
				<rect x="0" y="136" rx="0" ry="0" width="592" height="1" />
				<rect x="12" y="210" rx="4" ry="4" width="50" height="8" />
				<rect x="68" y="205" rx="4" ry="4" width="23" height="18" />
				<rect x="517" y="205" rx="4" ry="4" width="19" height="18" />
				<rect x="538" y="205" rx="4" ry="4" width="19" height="18" />
				<rect x="559" y="205" rx="4" ry="4" width="19" height="18" />
				<rect x="475" y="205" rx="4" ry="4" width="19" height="18" />
				<rect x="496" y="205" rx="4" ry="4" width="19" height="18" />
				<rect x="191" y="119" rx="4" ry="4" width="71" height="8" />
				<rect
					x={thumb ? "42" : "12"}
					y="146"
					rx="4"
					ry="4"
					width="60"
					height="8"
				/>
				{thumb ? (
					<rect x="12" y="140" rx="4" ry="4" width="23" height="20" />
				) : null}
				<rect x="319" y="146" rx="4" ry="4" width="71" height="8" />
				<rect x="554" y="143" rx="4" ry="4" width="7" height="15" />
				<rect x="429" y="146" rx="4" ry="4" width="71" height="8" />
				<rect x="0" y="163" rx="0" ry="0" width="592" height="1" />
				<rect x="191" y="146" rx="4" ry="4" width="71" height="8" />
				<rect
					x={thumb ? "42" : "12"}
					y="173"
					rx="4"
					ry="4"
					width="60"
					height="8"
				/>
				{thumb ? (
					<rect x="12" y="167" rx="4" ry="4" width="23" height="20" />
				) : null}
				<rect x="319" y="173" rx="4" ry="4" width="71" height="8" />
				<rect x="554" y="170" rx="4" ry="4" width="7" height="15" />
				<rect x="429" y="173" rx="4" ry="4" width="71" height="8" />
				<rect x="0" y="190" rx="0" ry="0" width="592" height="1" />
				<rect x="191" y="173" rx="4" ry="4" width="71" height="8" />
			</ContentLoader>
		</>
	);
};

export default ProductTableSkelton;
