import { StyleSheet, View } from "react-native";
import { WebView } from 'react-native-webview';
import { useSelector } from "react-redux";

export default function AppMap({lat, long}) {
    // MapLibreGL.setWellKnownTileServer(MapLibreGL.TileServers.MapLibre);
    // MapLibreGL.setAccessToken(null);

    const MAPTILER_API_KEY = "pwHAuntc2RkDMIkMLfXC";

    return (
        <View style={styles.container}>
            <WebView
                style={styles.map}
                source={{
                    uri: `https://www.google.com/maps/place/${lat},${long}`
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 500,
        zIndex: 22
    },
    map: {
        flex: 1,
    }
});
