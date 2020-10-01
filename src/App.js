/* eslint-disable */

import * as React from "react"
import CSS from "./CSS" // FIXME
import css from "tpl"
import px from "px"
import useMethods from "use-methods"
import useSorceryReducer from "useSorceryReducer"
import { v4 as uuidv4 } from "uuid"

/****/

function newID(desc) {
	return (!desc ? "" : desc + "__") + uuidv4().slice(0, 6)
}

/****/

const debugID = newID()

function Debug({ debug }) {
	return (
		<>
			<CSS id={debugID}>
				{css`
					.absolute__${debugID} {
						padding-top: ${px(12)};
						padding-right: ${px(12)};
						padding-bottom: ${px(12)};
						padding-left: ${px(12)};
						position: absolute;
						bottom: 0;
						left: 0;
						width: ${px(320)};
					}
					.pre__${debugID} {
						font-size: ${px(14)};
					}
				`}
			</CSS>

			<div className={`absolute__${debugID}`}>
				<pre className={`pre__${debugID}`}>{JSON.stringify(debug, null, 2)}</pre>
			</div>
		</>
	)
}

const activeElementID = newID()
const handleBarDebugID = newID()
const handleBarID = newID()

export default function App() {
	const [state, actions] = useSorceryReducer()

	return (
		<div
			style={{ height: "100vh" }}
			onPointerDown={actions.handlePointerDown}
			onPointerMove={e => {
				actions.handlePointerMove({
					x: Math.round(e.clientX),
					y: Math.round(e.clientY),
				})
			}}
			onPointerUp={actions.handlePointerUp}
		>
			{state.activeElement && (
				<>
					<CSS id={activeElementID}>
						{css`
							.activeElement__${activeElementID}:focus {
								outline: none;
							}
							.activeElement__${activeElementID}[data-focused="false"] {
								background-color: hsl(${3.25 * 60}, 100%, 90%);
								transition-property: background-color;
								transition-duration: 100ms;
								transition-timing-function: ease-out;
							}
							.activeElement__${activeElementID}[data-focused="true"] {
								background-color: hsl(${3.25 * 60}, 100%, 75%);
								transition-property: background-color;
								transition-duration: 50ms;
								transition-timing-function: ease-out;
							}
						`}
					</CSS>

					<div
						className={`activeElement__${activeElementID}`}
						style={state.activeElement.style}
						onFocus={e => {
							// console.log({ ...e })
							actions.focusActiveElement()
						}}
						onBlur={e => {
							if (!e.target.contains(e.relatedTarget)) {
								actions.blurActiveElement()
							}
						}}
						data-focused={state.activeElement.focusState.element}
						tabIndex={0}
					>
						<div style={{ position: "relative", height: "100%" }}>
							{/**/}

							<CSS id={handleBarDebugID}>
								{css`
									.absoluteDebug__${handleBarDebugID} {
										padding-top: ${px(8)};
										padding-right: ${px(8)};
										position: absolute;
										right: 0;
										bottom: 0;
										user-select: none;
									}
									.debug__${handleBarDebugID} {
										font-size: ${px(14)};
									}
								`}
							</CSS>

							<div className={`absoluteDebug__${handleBarDebugID}`}>
								<pre className={`debug__${handleBarDebugID}`}>{state.activeElement.style.height}px</pre>
							</div>

							{state.activeElement.focusState.element && (
								<>
									<CSS id={handleBarID}>
										{css`
											.absoluteHandleBar__${handleBarID} {
												padding-top: ${px(8)};
												position: absolute;
												top: 100%;
												right: 0;
												left: 0;
												display: flex;
												justify-content: center;
												align-items: center;
											}
											.handleBar__${handleBarID} {
												width: ${px(72)};
												height: ${px(8)};
												border-radius: 9999px;
											}
											.handleBar__${handleBarID} {
												background-color: hsl(${3.25 * 60}, 100%, 90%);
												transform: scale(1);
												transition-property: transform, background-color;
												transition-duration: 100ms;
												transition-timing-function: ease-out;
											}
											.handleBar__${handleBarID}:focus {
												outline: none;

												background-color: hsl(${3.25 * 60}, 100%, 75%);
												transform: scale(1.1);
												transition-property: transform, background-color;
												transition-duration: 50ms;
												transition-timing-function: ease-out;
											}
										`}
									</CSS>

									<div className={`absoluteHandleBar__${handleBarID}`}>
										<div
											className={`handleBar__${handleBarID}`}
											// onFocus={e => {
											// 	e.preventDefault()
											// 	e.stopPropagation()
											// }}
											// onBlur={e => {
											// 	e.preventDefault()
											// 	e.stopPropagation()
											// }}
											tabIndex={0}
										/>
									</div>
								</>
							)}

							{/**/}
						</div>
					</div>
				</>
			)}

			<Debug debug={state} />
		</div>
	)
}
