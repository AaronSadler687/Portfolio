#ifndef CARD_H
#define CARD_H

#include <iostream>
using std::ostream;

// Enumerated type that represents the card suits
enum suit { diamonds, clubs, hearts, spades, joker };

class Card
{
public:
	//default constructor - creates Joker card by calling 2-parameter constructor
	Card() : Card(-1, joker) {};

	//constructor that takes a card's face value (an integer) and its suit
	// card face values: Ace=0, 2=1, 3=2, ... Q=11, K=12
	Card(int, suit);

	// compare and return true if face value of *this is less than that of cd, false otherwise
	bool operator<(const Card& cd) const;

	// compare and return true if face value of *this is greater than that of cd, false otherwise
	bool operator>(const Card& cd) const;

	// compare and return true if face value of *this is less than or equal to that of cd, false otherwise
	bool operator<=(const Card& cd) const;

	// compare and return true if face value of *this is greater than or equal to that of cd, false otherwise
	bool operator>=(const Card& cd) const;

	// compare and return true if *this has the same face value as cd, false otherwise
	bool operator==(const Card& cd) const;

	// compare and return true if *this has the a different face value than cd, false otherwise
	bool operator!=(const Card& cd) const;

	// declare ostream << a friend of this class and overload << operator to display card
	friend ostream& operator << (ostream& os, const Card& cd)
	{
		switch (cd.cardFace)
		{
		case 10:
			os << "J";
			break;
		case 11:
			os << "Q";
			break;
		case 12:
			os << "K";
			break;
		case 0:
			os << "A";
			break;
		case -1:
			os << "j";
			break;
		default:
			os << cd.cardFace + 1;
		}
		switch (cd.cardSuit)
		{
		case 0:
			os << "D";
			break;
		case 1:
			os << "C";
			break;
		case 2:
			os << "H";
			break;
		case 3:
			os << "S";
			break;
		case 4:
			os << "*";
			break;
		}

		os << "[" << cd.cardFace + 1 << "]";
		return os;
	}


private:
	suit cardSuit;		// card's suit
	int cardFace;		  // card's face value
	int pointValue;		// card's point value (from its face)
};
#endif