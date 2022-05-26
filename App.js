import {
	StyleSheet,
	ImageBackground,
	Pressable,
	TouchableOpacity,
	Text,
	ScrollView,
	View,
} from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
	const [result, setResult] = useState({});
	const [fav, setFav] = useState([]);
	const [showFav, setShowFav] = useState(false);

	// Fetch initial joke
	useEffect(() => {
		fetchApiCall();
		loadFavoriteList();
	}, []);

	// Refreshes the joke and fetches a new random one
	const fetchApiCall = () => {
		fetch(
			"https://nova-joke-api.netlify.app/.netlify/functions/index/random_joke",
			{
				method: "GET",
			}
		)
			.then((res) => res.json())
			.then((joke) => setResult(joke))
			.catch((err) => console.error(err));
	};

	// Updates favorite state and local storage
	const addToFavoriteList = async () => {
		const newFav = [...fav, result];
		setFav(newFav);
		try {
			await AsyncStorage.setItem("joke", JSON.stringify(newFav));
		} catch (error) {
			// Error saving data
		}
	};
	const handleRemove = async (id) => {
		const newFav = fav.filter((item) => item.id !== id);

		setFav(newFav);
		try {
			await AsyncStorage.setItem("joke", JSON.stringify(newFav));
		} catch (error) {
			// Error saving data
			console.log(error);
		}
	};

	// Retrives from local storage and sets favorite state
	const loadFavoriteList = async () => {
		try {
			const jokes = await AsyncStorage.getItem("joke");
			if (jokes !== null) {
				// We have data!!
				console.log(jokes);
				setFav(JSON.parse(jokes));
			}
		} catch (error) {
			// Error retrieving data
			console.log(error);
		}
	};

	function FavList() {
		return (
			<View style={styles.favPageContainer}>
				<TouchableOpacity
					style={styles.homepageButton}
					onPress={() => {
						setShowFav(!showFav);
					}}
				>
					<Text style={styles.homepageButtonFontColor}> Back </Text>
				</TouchableOpacity>

				<ScrollView>
					{fav.map((favorite, index) => {
						return (
							<View style={styles.favContainer} key={favorite.id}>
								<View style={styles.favListContainer}>
									<Text style={styles.titleText}>
										{index + 1 + ". "}
										{favorite.setup}
									</Text>
									<Text style={styles.punchline}>{favorite.punchline}</Text>
								</View>
								<View style={styles.deleteButton}>
									<Pressable
										onPress={() => {
											handleRemove(favorite.id);
										}}
									>
										<Text style={styles.text}>❌</Text>
									</Pressable>
								</View>
							</View>
						);
					})}
				</ScrollView>
			</View>
		);
	}

	return (
		<ImageBackground
			source={require("./assets/bg.png")}
			style={styles.backgroundimage}
			resizeMode="stretch"
		>
			{showFav ? (
				<FavList></FavList>
			) : (
				<View style={styles.backgroundimage}>
					<Text style={styles.title}> Jokebox</Text>
					<TouchableOpacity
						style={styles.homepageButton}
						onPress={() => {
							setShowFav(!showFav);
						}}
					>
						<Text style={styles.homepageButtonFontColor}> Favorite List </Text>
					</TouchableOpacity>
					<View style={styles.jokeContainer}>
						<Text style={styles.titleText}>{result.setup}</Text>
						<Text style={styles.punchline}>{result.punchline}</Text>
						<View style={styles.favButton}>
							{fav.some((favorite) => favorite.id === result.id) ? (
								<TouchableOpacity
									style={styles.homepageFavButton}
									onPress={() => {
										handleRemove(result.id);
									}}
								>
									<Text> 💔 </Text>
								</TouchableOpacity>
							) : (
								<TouchableOpacity
									style={styles.homepageFavButton}
									onPress={addToFavoriteList}
								>
									<Text> ❤️ </Text>
								</TouchableOpacity>
							)}
						</View>
					</View>
					<TouchableOpacity
						style={styles.homepageButton}
						onPress={fetchApiCall}
					>
						<Text style={styles.homepageButtonFontColor}> New Joke </Text>
					</TouchableOpacity>
				</View>
			)}
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	backgroundimage: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	title: {
		fontSize: 50,
		marginBottom: 30,
		color: "#cd1d49",
	},
	homepageButton: {
		backgroundColor: "#cd1d49",
		padding: 10,
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 6,
		shadowOpacity: 0.5,
	},
	homepageButtonFontColor: {
		color: "#ffe19a",
		fontSize: 20,
	},
	homepageFavButton: {
		backgroundColor: "#ffe19a",
		padding: 5,
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "black",
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 6,
		shadowOpacity: 0.5,
	},
	jokeContainer: {
		height: 200,
		width: 300,
		margin: 10,
		borderRadius: 10,
		backgroundColor: "#ffe19a",
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "black",
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 4,
		shadowOpacity: 0.5,
		elevation: 2,
		padding: 20,
	},
	titleText: {
		fontSize: 15,
		fontWeight: "bold",
	},
	punchline: {
		fontSize: 15,
	},
	favButton: {
		margin: 10,
		padding: 10,
	},
	deleteButton: {
		margin: 10,
	},
	favPageContainer: {
		flex: 1,
		padding: 20,
		marginTop: 100,
	},
	favContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		padding: 5,
		margin: 10,
		marginVertical: 5,
	},
	favListContainer: {
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 6,
		shadowOpacity: 0.1,
		flexDirection: "row",
		flexWrap: "wrap",
		padding: 10,
		margin: 10,
		marginVertical: 0,
		backgroundColor: "white",
		borderRadius: 10,
	},
});
