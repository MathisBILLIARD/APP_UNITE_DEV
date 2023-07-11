import { View, Image } from 'react-native'
import React, { useEffect, useState } from 'react';
export default function MyFetchedImageBlob() {
    const imgUrl = "http://195.20.234.70:3000/events/photo/9A115675-96B6-4762-ADA0-5EFBF27127A1.JPG";

    return (
        <View>
            <Image source={{ uri: imgUrl }} style={{ width: 400, height: 900 }} />

        </View>
    )
}