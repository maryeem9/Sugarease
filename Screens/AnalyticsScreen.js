import React from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Dimensions,
} from "react-native";
import { LineChart } from "react-native-chart-kit";

const AnalyticsScreen = () => {
  const screenWidth = Dimensions.get("window").width;

  // Get current month name
  const currentMonth = new Date().toLocaleString("default", { month: "long" });

  return (
    <ScrollView style={styles.container}>
      {/* Month Heading */}
      <Text style={styles.monthTitle}>{currentMonth}</Text>

      {/* Line Graph for Macros */}

      

      {/* Scrollable Line Graph for Glucose (Fasting and Normal) and Blood Pressure */}

      <View style={styles.scrollingCard}>
      <Text style={styles.headings}>
        Glucose (Fasting and Normal) (mg/dL)
      </Text>
      <ScrollView horizontal>
        <LineChart
          data={{
            labels: Array.from({ length: 30 }, (_, i) => (i + 1).toString()),
            datasets: [
              { data: Array(30).fill().map(() => Math.random() * 50 + 80), color: () => "#423a9e" }, // Fasting Glucose
              { data: Array(30).fill().map(() => Math.random() * 50 + 110), color: () => "#afa8fb" }, // Normal Glucose
             
            ],
          }}
          width={screenWidth * 2} // Increase width for horizontal scrolling
          height={220}
          chartConfig={{
            backgroundGradientFrom: "#e8e6ff",
            backgroundGradientTo: "#e8e6ff",
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          bezier
          style={styles.chart}
        />
      </ScrollView>
      <View style={styles.legend}>
        <Text style={[styles.legendText, { color: "#423a9e" }]}>
          Fasting Glucose
        </Text>
        <Text style={[styles.legendText, { color: "#afa8fb" }]}>
          Normal Glucose
        </Text>
        
      </View>
      


      </View>
      
      {/* Line Graph for Glycemic Index */}

      <View style={styles.card}>
      <Text style={styles.headings}>Glycemic Index (GI) & Glucose Levels (mg/dL)</Text>
      <LineChart
        data={{
          labels: ["1", "10", "20", "30"],
          datasets: [
            { data: [50, 60, 55, 70], color: () => "#afa8fb" }, // Glycemic Index
            { data: [90, 100, 95, 110], color: () => "#8378fd" }, // Glucose Levels
          ],
        }}
        width={screenWidth - 50}
        height={220}
        chartConfig={{
          backgroundGradientFrom: "#e8e6ff",
          backgroundGradientTo: "#e8e6ff",
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          fillShadowGradient: "#a098fb", // Adds color to the shaded area
          fillShadowGradientOpacity: 0.3,
        }}
        bezier
        style={styles.chart}
      />
      <View style={styles.legend}>
        <Text style={[styles.legendText, { color: "#423a9e" }]}>
          Glycemic Index (GI)
        </Text>
        <Text style={[styles.legendText, { color: "#afa8fb" }]}>
          Glucose Levels
        </Text>
      </View>

      </View>
      
      {/* Line Graph for Weight */}

      <View style={styles.card}>
      <Text style={styles.headings}>Weight (kg)</Text>
      <LineChart
        data={{
          labels: ["1", "10", "20", "30"],
          datasets: [{ data: [70, 71, 70.5, 71.2], color: () => "#423a9e" }], // Weight
          
        }}
        width={screenWidth - 50}
        height={220}
        chartConfig={{
          backgroundGradientFrom: "#e8e6ff",
          backgroundGradientTo: "#e8e6ff",
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          fillShadowGradient: "#a098fb", // Adds color to the shaded area
          fillShadowGradientOpacity: 0.3,
        }}
        bezier
        style={styles.chart} // Added marginBottom for extra space
      />
      <View style={styles.legend}>
        <Text style={[styles.legendText, { color: "#423a9e" }]}>
          Weight
        </Text>
      </View>

      </View>
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#e8e6ff", padding: 10 },
  monthTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
    color: "#5d4489",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#a098fb",
    lineHeight: 22, // Ensures proper line spacing for long titles
  },
  chart: { 
    marginVertical: 10,
     borderRadius: 10 },
  legend: {
    flexDirection: "row",
    justifyContent: "space-around",
    margin: 5,
  },
  legendText: { fontSize: 12, fontWeight: "bold" },
  card:{
    backgroundColor: '#f3f2fb',
    padding: 8,
    borderRadius: 10,
    elevation:10,
    margin: 8,
    marginBottom: 10
  },
  scrollingCard:{
    backgroundColor: '#f3f2fb',
    padding: 8,
    elevation:10,
    margin: 8,
    borderRadius: 10,
  },
  headings:{
    fontSize: 18, // Slightly larger for better visibility
    fontWeight: 'bold',
    color: '#5d4489',
    marginBottom: 8,
    letterSpacing: 0.5, // Improves readability
    marginTop: 15,
    alignItems: 'center'
  },
});

export default AnalyticsScreen;