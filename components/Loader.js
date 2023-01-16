import cn from "classnames"
import styles from "components/Loader.module.css"

export const Loader = ({ className }) => {
	return (
		<span className={cn(className, styles.root)}>
			<span />
			<span />
			<span />
		</span>
	)
}
