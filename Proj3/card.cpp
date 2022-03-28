/*
* Name: Aaron Sadler
* Course: CSCI 3110-001
* Project: Proj3
* Due: 10/4/2021
* Overview: This is the implmentation file for card.h
*/

#include "card.h"

using namespace std;

Card::Card(int x, suit y)
{
	cardSuit = y;
	cardFace = x;
	if (cardFace < 9)
	{
		pointValue = cardFace + 1;
	}
	if (cardFace >= 9)
	{
		pointValue = 10;
	}
}

bool Card::operator<(const Card& cd) const
{
	return this->cardFace < cd.cardFace;
}

bool Card::operator>(const Card& cd) const
{
	return this->cardFace > cd.cardFace;
}

bool Card::operator<=(const Card& cd) const
{
	return this->cardFace <= cd.cardFace;
}

bool Card::operator>=(const Card& cd) const
{
	return this->cardFace >= cd.cardFace;
}

bool Card::operator==(const Card& cd) const
{
	return this->cardFace == cd.cardFace;
}

bool Card::operator!=(const Card& cd) const
{
	return this->cardFace != cd.cardFace;
}